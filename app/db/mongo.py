import motor.motor_asyncio
import logging
from fastapi import Depends
from app.config import settings

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

mongodb_manager = MongoDBManager()

async def get_mongo() -> MongoDBManager:
    return mongodb_manager