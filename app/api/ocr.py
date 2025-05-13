import json
import logging
import aiomysql
from pathlib import Path
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from pydantic import BaseModel
from app.services.decryption import DecryptionService
from app.services.ocr_engine import OcrEngine
from app.services.postprocessing import postprocessing_pipeline
from app.db.mysql import get_mysql, MySQLManager
from app.db.mongo import get_mongo
from app.services.summarization import generate_summary

router = APIRouter()
logger = logging.getLogger(__name__)

class OcrRequest(BaseModel):
    contract_id: int

@router.post("")
async def ocr_endpoint(
    req: OcrRequest,
    bg: BackgroundTasks,
    mysql: MySQLManager = Depends(get_mysql),
    mongo=Depends(get_mongo),
):
    service = DecryptionService(mysql, mongo)
    engine  = OcrEngine()

    # 이미 OCR 결과가 있는지 확인
    ocr_exists = await check_existing_ocr(req.contract_id, mysql)
    if ocr_exists:
        # 요약 정보만 확인하고 없으면 요약만 생성
        summary_exists = await check_existing_summary(req.contract_id, mongo)
        if summary_exists:
            return {"status": "success", "detail": "이미 OCR 및 요약 정보가 존재합니다."}
        else:
            # OCR 결과는 있지만 요약은 없는 경우, 요약만 생성
            bg.add_task(summary_only_task, req.contract_id, mysql, mongo)
            return {"status": "accepted", "detail": "백그라운드에서 요약 작업을 시작했습니다."}

    async def task():
        cid = req.contract_id
        try:
            logger.info(f"[{cid}] 복호화 시작")
            pdf_bytes = await service.decrypt(cid)
            logger.info(f"[{cid}] PDF 복호화 완료, OCR 시작")
            ocr_res   = await engine.recognize(pdf_bytes)
            logger.info(f"[{cid}] OCR 완료, 결과 크기: {len(json.dumps(ocr_res))} bytes")
        except Exception as e:
            logger.error(f"[{cid}] OCR 에러: {e}")
            return

        # 후처리 파이프라인
        logger.info(f"[{cid}] 후처리 파이프라인 실행")
        pages = postprocessing_pipeline(ocr_res, cid)
        await mysql.insert_ocr_results(pages)
        logger.info(f"[{req.contract_id}] OCR 결과 {len(pages)}건 DB 저장 완료")

        # AI 분석 진행
        await process_ai_analysis(cid, pages, mongo)

    bg.add_task(task)
    return {"status": "accepted", "detail": "백그라운드에서 OCR 작업을 시작했습니다."}


async def check_existing_ocr(contract_id: int, mysql: MySQLManager) -> bool:
    """MySQL DB에 이미 OCR 결과가 있는지 확인합니다."""
    if not mysql.pool:
        logger.warning("MySQL pool is not initialized!")
        return False
        
    try:
        async with mysql.pool.acquire() as conn:
            async with conn.cursor() as cur:
                query = "SELECT COUNT(*) FROM ocr_result WHERE contract_id = %s"
                await cur.execute(query, (contract_id,))
                count = await cur.fetchone()
                return count and count[0] > 0
    except Exception as e:
        logger.error(f"OCR 결과 확인 중 오류: {e}")
        return False


async def check_existing_summary(contract_id: int, mongo) -> bool:
    """MongoDB에 이미 요약 결과가 있는지 확인합니다."""
    try:
        # 1. ai_analysis_report에서 해당 contract_id의 문서 찾기
        report = await mongo.db.ai_analysis_report.find_one({"contractId": contract_id})
        if not report:
            return False
            
        # 2. summary_report에서 해당 ai_analysis_report_id의 요약 찾기
        summary_doc = await mongo.db.summary_report.find_one(
            {"aiAnalysisReportId": report["_id"]}
        )
        return summary_doc is not None
    except Exception as e:
        logger.error(f"요약 결과 확인 중 오류: {e}")
        return False


async def summary_only_task(contract_id: int, mysql: MySQLManager, mongo):
    """OCR 결과는 있지만 요약이 없는 경우, 요약만 생성하는 함수"""
    try:
        # OCR 결과 불러오기
        pages = await get_ocr_results(contract_id, mysql)
        if not pages:
            logger.error(f"[{contract_id}] OCR 결과를 불러올 수 없습니다.")
            return
            
        # AI 분석 진행
        await process_ai_analysis(contract_id, pages, mongo)
    except Exception as e:
        logger.error(f"[{contract_id}] 요약 생성 중 오류: {e}", exc_info=True)


async def get_ocr_results(contract_id: int, mysql: MySQLManager) -> list[dict]:
    """MySQL DB에서 OCR 결과를 불러옵니다."""
    try:
        async with mysql.pool.acquire() as conn:
            async with conn.cursor(aiomysql.DictCursor) as cur:
                query = """
                SELECT contract_id, page_no, ocr_text as cleaned_markdown 
                FROM ocr_result 
                WHERE contract_id = %s 
                ORDER BY page_no
                """
                await cur.execute(query, (contract_id,))
                results = await cur.fetchall()
                return results
    except Exception as e:
        logger.error(f"OCR 결과 가져오기 오류: {e}")
        return []


async def process_ai_analysis(contract_id: int, pages: list[dict], mongo):
    """AI 분석 및 요약을 처리하는 함수"""
    try:
        analysis_id = await mongo.insert_ai_analysis_report(contract_id)
        all_text = "\n\n".join(p["cleaned_markdown"] for p in pages)

        # 랭체인을 사용한 개선된 요약 생성
        summary = await generate_summary(all_text, contract_id, mongo)
        
        # 요약 결과 저장
        inserted_mongo_id = await mongo.insert_summary_report(str(analysis_id), summary)
        logger.info(f"[{contract_id}] SummaryReport MongoDB 저장 완료 _id={inserted_mongo_id}")
    except Exception as e:
        logger.error(f"[{contract_id}] AI 분석 처리 중 오류: {e}", exc_info=True)