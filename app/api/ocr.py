import json
import logging
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
        pages   = postprocessing_pipeline(ocr_res, cid)
        await mysql.insert_ocr_results(pages)
        logger.info(f"[{req.contract_id}] OCR 결과 {len(pages)}건 DB 저장 완료")

        analysis_id = await mongo.insert_ai_analysis_report(cid)
        all_text = "\n\n".join(p["cleaned_markdown"] for p in pages)

        try:
            summary = await generate_summary(all_text)
            inserted_mongo_id = await mongo.insert_summary_report(str(analysis_id), summary)
            logger.info(f"[{cid}] SummaryReport MongoDB 저장 완료 _id={inserted_mongo_id}")                      
        except Exception as e:
            logger.error(f"[{cid}] AI 요약 실패: {e}", exc_info=True)

    bg.add_task(task)
    return {"status": "accepted", "detail": "백그라운드에서 OCR 작업을 시작했습니다."}
