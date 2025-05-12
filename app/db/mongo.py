import motor.motor_asyncio
import logging
from fastapi import Depends
from bson import ObjectId
from app.config import settings
from datetime import datetime

logger = logging.getLogger(__name__)

class MongoDBManager:
    client: motor.motor_asyncio.AsyncIOMotorClient = None
    db = None

    async def connect(self):
        logger.info("Connecting to MongoDB…")
        uri = settings.MONGODB_HOST
        self.client = motor.motor_asyncio.AsyncIOMotorClient(
            uri,
            username=settings.MONGODB_USER,
            password=settings.MONGODB_PASSWORD,
            authSource=settings.MONGODB_AUTH_DB
        )
        self.db = self.client[settings.MONGODB_DB]

    async def disconnect(self):
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")

    async def get_share_b(self, file_id: int):
        doc = await self.db.keyShare.find_one({"fileId": file_id})
        return doc and doc.get("shareB")
    
    async def insert_ai_analysis_report(self, contract_id: int) -> str:
        """
        ai_analysis_report 컬렉션에 새 문서를 삽입하고,
        생성된 ObjectId를 문자열로 반환합니다.
        """
        doc = {
            "contractId": contract_id,
            "createdAt": datetime.now()
        }
        res = await self.db["ai_analysis_report"].insert_one(doc)
        return str(res.inserted_id)
    
    async def insert_summary_report(self, ai_analysis_report_id: str, description: str) -> ObjectId:
        """
        ai_analysis_report_id: MySQL에서 생성된 분석보고서 ID를 문자열로 전달
        description: 요약 텍스트
        """
        doc = {
            "aiAnalysisReportId": ObjectId(ai_analysis_report_id),
            "description": description,
            "createdAt": datetime.now()
        }
        res = await self.db["summary_report"].insert_one(doc)
        logger.info(f"Inserted summary_report _id={res.inserted_id}")
        return res.inserted_id

mongodb_manager = MongoDBManager()

async def get_mongo() -> MongoDBManager:
    return mongodb_manager