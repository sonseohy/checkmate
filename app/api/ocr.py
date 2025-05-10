import json
import logging
from pathlib import Path
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from pydantic import BaseModel
from app.services.decryption import DecryptionService
from app.services.ocr_engine import OcrEngine
from app.services.postprocessing import postprocessing_pipeline
from app.db.mysql import get_mysql
from app.db.mongo import get_mongo

router = APIRouter()
logger = logging.getLogger(__name__)

class OcrRequest(BaseModel):
    contract_id: int

@router.post("")
async def ocr_endpoint(
    req: OcrRequest,
    bg: BackgroundTasks,
    mysql=Depends(get_mysql),
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
            result    = await engine.recognize(pdf_bytes)
            logger.info(f"[{cid}] OCR 완료, 결과 크기: {len(json.dumps(result))} bytes")
        except Exception as e:
            logger.error(f"[{cid}] OCR 에러: {e}")
            return

        out_dir = Path("ocr_outputs")
        out_dir.mkdir(exist_ok=True)
        raw_path = out_dir / f"{cid}.json"
        with raw_path.open("w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        logger.info(f"[{cid}] 원본 OCR 결과 저장: {raw_path}")

        # 후처리 파이프라인
        try:
            logger.info(f"[{cid}] 후처리 파이프라인 실행")
            analysis = postprocessing_pipeline(result, cid)
            analysis_path = out_dir / f"{cid}_analysis.json"
            with analysis_path.open("w", encoding="utf-8") as f:
                json.dump(analysis, f, ensure_ascii=False, indent=2)
            logger.info(f"[{cid}] 후처리 결과 저장: {analysis_path}")
        except Exception as e:
            logger.error(f"[{cid}] 후처리 에러: {e}")

    bg.add_task(task)
    return {"status": "accepted", "detail": "백그라운드에서 OCR 작업을 시작했습니다."}
