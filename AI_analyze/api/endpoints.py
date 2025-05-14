import asyncio
from uuid import uuid4

from fastapi import APIRouter, Depends, BackgroundTasks

from db.mongo import MongoDBManager
from db.mysql import MySQLManager
from db.redis import OCRCache
from models.schemas import OcrRequest
from nlp.llm import init_llm_model
from services.contract_analyzer import analyze_contract_parallel
from services.contract_parser import structure_contract_with_gpt
from services.decryption import DecryptionService
from services.legal_retriever import get_contract_type_requirements, get_clause_specific_laws_parallel
from services.ocr_engine import OcrEngine
from services.postprocessing import postprocessing_pipeline
from services.summarization import generate_summary
from utils.dependencies import get_mongo, get_mysql, get_ocr_cache, get_vector_store
from utils.logging import setup_logger

logger = setup_logger(__name__)
router = APIRouter()


@router.get("/status/{job_id}")
async def check_job_status(
        job_id: str,
        ocr_cache: OCRCache = Depends(get_ocr_cache)
):
    """작업 상태 확인"""

    # Redis 또는 DB에서 작업 상태 조회
    job_status = await ocr_cache.get_job_status(job_id)

    if not job_status:
        return {
            "status": "not_found",
            "message": "작업을 찾을 수 없습니다."
        }

    return {
        "status": job_status["status"],
        "job_id": job_id,
        "contract_id": job_status["contract_id"],
        "data": job_status.get("result"),
        "error": job_status.get("error")
    }


@router.post("/ocr")
async def ocr_endpoint(
        req: OcrRequest,
        background_tasks: BackgroundTasks,
        mysql: MySQLManager = Depends(get_mysql),
        mongo: MongoDBManager = Depends(get_mongo),
        vector_store=Depends(get_vector_store),
        ocr_cache: OCRCache = Depends(get_ocr_cache),
):
    """OCR → 요약 → 분석 통합 엔드포인트"""

    service = DecryptionService(mysql, mongo)
    engine = OcrEngine()

    # 기존 데이터 확인
    existing_data = await check_existing_data(req.contract_id, mongo)
    logger.info(f'존재하는 데이터: {existing_data}')

    if existing_data['summary'] and existing_data['analysis']:
        return {
            "status": "completed",
            "detail": "이미 처리 완료된 계약서입니다.",
            "data": existing_data
        }

    # 작업 ID 생성
    job_id = str(uuid4())

    # 작업 상태 저장 (Redis 또는 DB)
    await ocr_cache.save_job_status(job_id, req.contract_id, "processing")

    # 백그라운드 작업 추가
    background_tasks.add_task(
        process_contract_background,
        job_id,
        req,
        service,
        engine,
        mysql,
        mongo,
        vector_store,
        existing_data,
        ocr_cache
    )

    # 즉시 응답
    return {
        "status": "processing",
        "message": "계약서 분석이 시작되었습니다. 잠시 후 결과를 확인해주세요.",
    }


async def process_contract_background(
        job_id: str,
        req: OcrRequest,
        decryption_service: DecryptionService,
        ocr_engine: OcrEngine,
        mysql: MySQLManager,
        mongo: MongoDBManager,
        vector_store,
        existing_data: dict,
        ocr_cache: OCRCache
):
    """백그라운드에서 계약서 처리"""
    try:
        # 기존 process_contract_pipeline 호출
        result_data = await process_contract_pipeline(
            req,
            decryption_service,
            ocr_engine,
            mysql,
            mongo,
            vector_store,
            existing_data,
            ocr_cache
        )

        # 작업 상태 업데이트
        await ocr_cache.save_job_status(job_id, req.contract_id, "completed", result_data)

    except Exception as e:
        logger.error(f"백그라운드 처리 오류: {e}", exc_info=True)
        await ocr_cache.save_job_status(job_id, req.contract_id, "failed", str(e))


async def process_contract_pipeline(
        req: OcrRequest,
        decryption_service: DecryptionService,
        ocr_engine: OcrEngine,
        mysql: MySQLManager,
        mongo: MongoDBManager,
        vector_store,
        existing_data: dict,
        ocr_cache: OCRCache
):
    """OCR → 요약 → 분석 파이프라인"""
    cid = req.contract_id

    try:
        # 1. OCR 처리
        pages = await get_ocr_result(cid, decryption_service, ocr_engine, ocr_cache)
        all_text = "\n\n".join(p["cleaned_markdown"] for p in pages)

        # 2. AI 분석 보고서 ID 생성/가져오기
        if not existing_data['analysis']:
            ai_analysis_report_id = await mongo.save_ai_analysis_report(cid)
        else:
            report = await mongo.db.ai_analysis_report.find_one({"contractId": cid})
            ai_analysis_report_id = str(report["_id"])

        llm = init_llm_model(temperature=0.0)
        tasks = []

        # 3. 요약 생성
        if not existing_data['summary']:
            summary_task = generate_summary(all_text, cid, mongo)
            tasks.append(("summary", summary_task))

        # 4. 구조화 및 분석
        logger.info(f"[{cid}] 구조화 및 분석 시작")

        structured_contract_task = structure_contract_with_gpt(all_text, cid, llm)
        tasks.append(("structure", structured_contract_task))

        results = await execute_parallel_tasks(tasks)

        summary_result = results.get("summary")
        structured_contract = results.get("structure")

        contract_type = structured_contract.metadata.contract_type
        # 5. MySQL에 조항 저장
        sections_data = []
        for section in structured_contract.sections:
            sections_data.append({
                'number': section.number,
                'title': section.title,
                'content': section.content,
                'type': section.type,
            })

        # 8. 구조화 완료 후 병렬 처리할 태스크들
        second_round_tasks = [
            ("mysql_save", mysql.save_contract_clauses(cid, sections_data)),
            ("summary_save",
             mongo.save_summary_report(ai_analysis_report_id, summary_result) if summary_result else None),
            ("required_sections", get_contract_type_requirements(vector_store, contract_type, llm)),
            ("clause_laws", get_clause_specific_laws_parallel(structured_contract, vector_store))
        ]

        # None이 아닌 작업만 필터링
        second_round_tasks = [(name, task) for name, task in second_round_tasks if task is not None]

        second_results = await execute_parallel_tasks(second_round_tasks)

        required_sections = second_results.get("required_sections")
        clause_specific_laws = second_results.get("clause_laws")

        # 10. 최종 분석 (모든 준비가 완료된 후)
        logger.info(f"[{cid}] 최종 분석 시작")
        await analyze_contract_parallel(
            llm,
            structured_contract,
            req.contract_category_id,
            mongo,
            mysql,
            ai_analysis_report_id,
            required_sections,
            clause_specific_laws,
            contract_type
        )

        logger.info(f"[{cid}] 전체 파이프라인 완료")
        return {
            "success": True,
            "contract_id": cid,
            "analysis_completed": True
        }

    except Exception as e:
        logger.error(f"[{cid}] 파이프라인 오류: {e}", exc_info=True)
        raise


async def execute_parallel_tasks(tasks):
    """병렬 태스크 실행 헬퍼 함수"""
    results = {}

    # 태스크 이름과 코루틴을 분리
    task_names = []
    coroutines = []

    for name, coro in tasks:
        if coro is not None:
            task_names.append(name)
            coroutines.append(coro)

    # 병렬 실행
    if coroutines:
        # 모든 작업을 동시에 실행
        task_results = await asyncio.gather(*coroutines, return_exceptions=True)

        # 병렬 처리 종료 시간
        # 결과 매핑
        for name, result in zip(task_names, task_results):
            if isinstance(result, Exception):
                logger.error(f"Task {name} failed: {result}")
                raise result
            results[name] = result

    return results


async def check_existing_data(contract_id: int, mongo: MongoDBManager) -> dict:
    """기존 데이터 확인"""
    result = {
        'summary': False,
        'analysis': False
    }

    # 분석 및 요약 확인
    try:
        report = await mongo.db.ai_analysis_report.find_one({"contractId": contract_id})
        logger.info(f"[{contract_id}] : {report}")
        if report:
            result['analysis'] = True

            summary_doc = await mongo.db.summary_report.find_one(
                {"aiAnalysisReportId": report["_id"]}
            )
            logger.info(f"[{contract_id}] : {summary_doc}")
            result['summary'] = summary_doc is not None
    except Exception as e:
        logger.error(f"분석/요약 확인 오류: {e}")

    return result


# 헬퍼 함수들
async def get_ocr_result(cid, decryption_service, ocr_engine, ocr_cache):
    """OCR 결과 가져오기 (캐시 확인)"""
    cached_pages = await ocr_cache.get(cid)

    if cached_pages:
        logger.info(f"[{cid}] 캐시에서 OCR 결과 로드")
        return cached_pages

    logger.info(f"[{cid}] OCR 시작")
    pdf_bytes = await decryption_service.decrypt(cid)
    ocr_result = await ocr_engine.recognize(pdf_bytes)
    pages = postprocessing_pipeline(ocr_result, cid)

    # 캐시 저장을 비동기로 처리
    asyncio.create_task(ocr_cache.set(cid, pages))

    return pages
