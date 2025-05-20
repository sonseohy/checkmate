import asyncio
import json
import re
import time
from typing import Dict, Any, List

from langchain.chains import LLMChain
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

from models.schemas import StructuredContract
from nlp.prompts import (
    missing_sections_prompt,
    improvements_prompt,
    risk_analysis_prompt,
    questions_generation_prompt
)
from utils.logging import setup_logger


# 빈 응답 예외 클래스
class EmptyResponseError(Exception):
    pass


logger = setup_logger(__name__)


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=retry_if_exception_type(EmptyResponseError),
    reraise=True
)
async def analyze_with_retry(llm, prompt_template, input_data: dict) -> dict:
    """LLM 호출 및 재시도 로직"""
    chain = prompt_template | llm

    result = await chain.ainvoke(input_data)
    # 결과 텍스트 추출
    if hasattr(result, 'content'):
        result_text = result.content
    else:
        result_text = str(result)

    # 빈 응답 체크
    if not result_text or not result_text.strip():
        logger.error("빈 응답을 받았습니다. 재시도합니다.")
        raise EmptyResponseError("Empty response from LLM")

    # JSON 파싱
    json_pattern = r'```(?:json)?\s*([\s\S]*?)\s*```'
    json_match = re.search(json_pattern, result_text)

    try:
        if json_match:
            parsing_data = json.loads(json_match.group(1))
        else:
            parsing_data = json.loads(result_text.strip())
    except json.JSONDecodeError:
        logger.error("JSON 파싱 실패. 재시도합니다.")
        raise EmptyResponseError("Invalid JSON response")

    return parsing_data


async def analyze_contract_parallel(
        llm,
        structured_contract: StructuredContract,
        contract_category_id: int,
        mongo_manager,
        mysql_manager,
        ai_analysis_report_id: str,
        required_sections: List[str],
        clause_specific_laws: Dict,
        contract_type: str  # 추가
) -> Dict[str, Any]:
    """계약서 전체를 분석하여 누락 조항, 개선 사항, 위험 영역 식별"""

    logger.info(f"계약서 분석 시작: {structured_contract.contract_id}")

    analysis_tasks = []

    # 3. 법률 컨텍스트 포매팅
    legal_context = format_clause_laws(clause_specific_laws)

    # 필수 조항 목록을 텍스트로 변환
    required_sections_text = "\n".join([f"- {section}" for section in required_sections])

    # 계약서 전체 내용
    content = "\n\n".join([f"{section.number} {section.title}\n{section.content}"
                           for section in structured_contract.sections])

    # 공통 입력 데이터
    common_data = {
        "title": structured_contract.metadata.title,
        "contract_type": contract_type,
        "content": content[:15000],  # 토큰 제한을 위해 길이 제한
        "legal_context": legal_context
    }

    # 1. 누락 조항 분석 (전체 필수 조항 정보 필요)
    missing_input = {
        **common_data,
        "required_sections": required_sections_text
    }
    analysis_tasks.append(("missing", analyze_with_retry(llm, missing_sections_prompt, missing_input)))

    # 2. 개선사항 분석
    improvements_input = common_data.copy()
    analysis_tasks.append(("improvements", analyze_with_retry(llm, improvements_prompt, improvements_input)))

    # 3. 위험 조항 분석
    risks_input = common_data.copy()
    analysis_tasks.append(("risks", analyze_with_retry(llm, risk_analysis_prompt, risks_input)))

    # 4. 질문 생성
    questions_input = {
        "title": structured_contract.metadata.title,
        "contract_type": contract_type,
        "content": content[:15000]
    }
    analysis_tasks.append(("questions", analyze_with_retry(llm, questions_generation_prompt, questions_input)))

    # 병렬 실행
    results = {}
    try:
        # 각 태스크의 시작 시간 기록
        task_starts = {}
        for name, task in analysis_tasks:
            task_starts[name] = time.time()
        responses = await asyncio.gather(*[task for _, task in analysis_tasks])
        # 결과 매핑
        for (name, _), response in zip(analysis_tasks, responses):
            results[name] = response

        # 각 분석 결과 저장
        await save_analysis_results(
            results,
            ai_analysis_report_id,
            structured_contract.contract_id,
            contract_category_id,
            mongo_manager,
            mysql_manager
        )

        logger.info(f"계약서 병렬 분석 완료: {structured_contract.contract_id}")

        return {
            "ai_analysis_report_id": str(ai_analysis_report_id),
            "analysis_completed": True
        }

    except Exception as e:
        logger.error(f"계약서 분석 오류: {e}")
        raise


def format_clause_laws(clause_specific_laws: Dict) -> str:
    """조항별 법률 정보 포매팅"""
    if not clause_specific_laws:
        return "관련 법률 정보 없음"

    formatted = "=== 조항별 관련 법률 ===\n\n"

    for clause_num, clause_info in clause_specific_laws.items():
        formatted += f"{clause_num} - {clause_info['title']}\n"

        if clause_info.get('laws'):
            for law in clause_info['laws'][:2]:  # 각 조항당 최대 2개 법률만
                if hasattr(law, 'metadata'):
                    law_name = law.metadata.get('law_name', '알 수 없음')
                    article = law.metadata.get('article_number', '')
                    content = law.page_content[:200] if hasattr(law, 'page_content') else str(law)[:200]
                else:
                    law_name = "관련 법률"
                    article = ""
                    content = str(law)[:200]

                formatted += f"  • {law_name} {article}: {content}...\n"
        else:
            formatted += "  • 관련 법률 없음\n"

        formatted += "\n"

    return formatted[:3000]  # 전체 길이 제한


async def save_analysis_results(
        results: Dict,
        ai_analysis_report_id: str,
        contract_id: int,
        contract_category_id: int,
        mongo_manager,
        mysql_manager
):
    """분석 결과를 DB에 저장"""

    save_tasks = []

    # 1. 누락 조항 저장
    missing_sections = results.get("missing", {}).get("missing_sections", [])
    for item in missing_sections:
        task = mongo_manager.save_missing_clause_report(
            ai_analysis_report_id,
            item.get("severity", "중간"),
            item.get("description", "")
        )
        save_tasks.append(task)

    # 2. 개선 사항 저장
    improvements = results.get("improvements", {}).get("improvement_recommendations", [])
    for item in improvements:
        task = mongo_manager.save_improvement_report(
            ai_analysis_report_id,
            item.get("description", "")
        )
        save_tasks.append(task)

    # 3. 위험 영역 저장
    risk_clauses = results.get("risks", {}).get("risk_clauses", [])
    for item in risk_clauses:
        task = mongo_manager.save_risk_clause_report(
            ai_analysis_report_id,
            item.get("severity", "중간"),
            item.get("original_text", ""),
            item.get("description", "")
        )
        save_tasks.append(task)

    # 4. 질문 저장
    questions_data = results.get("questions", {}).get("questions", [])

    if save_tasks:
        try:
            # 최대 10개씩 배치로 실행 (DB 부하 방지)
            batch_size = 10
            for i in range(0, len(save_tasks), batch_size):
                batch = save_tasks[i:i + batch_size]

                # 병렬 실행
                results = await asyncio.gather(*batch, return_exceptions=True)

                # 에러 확인
                for idx, result in enumerate(results):
                    if isinstance(result, Exception):
                        logger.error(f"DB 저장 작업 {i + idx} 실패: {result}")
        except Exception as e:
            logger.error(f"MongoDB 저장 중 오류 발생: {e}")

    # MySQL 질문 배치 저장 (별도 처리)
    if questions_data:
        try:
            await mysql_manager.save_questions_batch(
                contract_id,
                contract_category_id,
                questions_data
            )
        except Exception as e:
            logger.error(f"질문 배치 저장 실패: {e}")

    logger.info(f"분석 결과 저장 완료")
