import aiomysql
import logging
from fastapi import Depends
from app.config import settings
from datetime import datetime

logger = logging.getLogger(__name__)

class MySQLManager:
    pool: aiomysql.Pool = None

    async def connect(self):
        try:
            logger.info(f"Initializing MySQL pool... Host: {settings.MYSQL_HOST}, Port: {settings.MYSQL_PORT}, User: {settings.MYSQL_USER}, DB: {settings.MYSQL_DB}")
            
            self.pool = await aiomysql.create_pool(
                host=settings.MYSQL_HOST,
                port=settings.MYSQL_PORT,
                user=settings.MYSQL_USER,
                password=settings.MYSQL_PASSWORD,
                db=settings.MYSQL_DB,
                autocommit=True,
                connect_timeout=10  # 추가: 연결 타임아웃 설정
            )
            logger.info("MySQL pool initialized successfully!")
        except Exception as e:
            logger.error(f"MySQL connection error: {str(e)}")
            # 연결 문자열 관련 정보 출력 (비밀번호 제외)
            logger.error(f"Connection details: Host={settings.MYSQL_HOST}, Port={settings.MYSQL_PORT}, User={settings.MYSQL_USER}, DB={settings.MYSQL_DB}")
            raise

    async def disconnect(self):
        if self.pool:
            self.pool.close()
            await self.pool.wait_closed()
            logger.info("MySQL pool closed")

    async def get_contract_file_info(self, contract_id: int, file_category: str = "VIEWER"):
        if not self.pool:
            logger.error("MySQL pool is not initialized!")
            raise RuntimeError("Database connection not established")
            
        async with self.pool.acquire() as conn:
            async with conn.cursor(aiomysql.DictCursor) as cur:
                query = """
                SELECT id, file_address, encrypted_data_key, iv
                FROM contract_file
                WHERE contract_id=%s AND file_category=%s
                """
                logger.debug(f"Executing query: {query} with params: {contract_id}, {file_category}")
                await cur.execute(query, (contract_id, file_category))
                result = await cur.fetchone()
                logger.debug(f"Query result: {result}")
                return result
    
    async def insert_ocr_results(self, rows: list[dict]):
        """
        rows: List of dicts with keys 'contract_id', 'page_no', 'cleaned_markdown'
        """
        if not self.pool:
            raise RuntimeError("MySQL pool is not initialized")
        insert_sql = """
            INSERT INTO ocr_result (contract_id, page_no, ocr_text, created_at)
            VALUES (%s, %s, %s, %s)
        """
        # prepare list of tuples
        params = [
            (r["contract_id"], r["page_no"], r["cleaned_markdown"], datetime.now())
            for r in rows
        ]
        async with self.pool.acquire() as conn:
            async with conn.cursor() as cur:
                # executemany 으로 한 번에
                await cur.executemany(insert_sql, params)
                logger.info(f"Inserted {len(params)} OCR result rows into ocr_result")

mysql_manager = MySQLManager()

async def get_mysql() -> MySQLManager:
    if mysql_manager.pool is None:
        logger.warning("MySQL pool accessed before initialization!")
    return mysql_manager