from datetime import datetime

import aiomysql

from config.settings import (
    MYSQL_HOST, MYSQL_PORT, MYSQL_USERNAME,
    MYSQL_PASSWORD, MYSQL_DATABASE
)
from models.enums import ClauseType
from utils.logging import setup_logger

logger = setup_logger(__name__)


class MySQLManager:
    def __init__(self):
        self.pool = None

    async def connect(self):
        """MySQL 연결"""
        try:
            self.pool = await aiomysql.create_pool(
                host=MYSQL_HOST,
                port=MYSQL_PORT,
                user=MYSQL_USERNAME,
                password=MYSQL_PASSWORD,
                db=MYSQL_DATABASE,
                autocommit=True,
                connect_timeout=10,  # 연결 타임아웃 증가
                minsize=1,
                maxsize=10
            )

            logger.info("MySQL Pool 생성 완료")

        except Exception as e:
            logger.error(f"MySQL 연결 오류: {e}")
            raise

    async def disconnect(self):
        """MySQL 연결 종료"""
        if self.pool:
            self.pool.close()
            await self.pool.wait_closed()
            logger.info("MySQL Pool 종료 완료")

    async def get_contract_file_info(self, contract_id: int, file_category: str = "VIEWER"):
        """계약서 파일 정보 조회"""
        if not self.pool:
            raise Exception("MySQL pool이 초기화되지 않았습니다.")
        async with self.pool.acquire() as conn:
            async with conn.cursor(aiomysql.DictCursor) as cur:
                query = """
                        SELECT id, file_address, encrypted_data_key, iv
                        FROM contract_file
                        WHERE contract_id = %s \
                          AND file_category = %s \
                        """
                await cur.execute(query, (contract_id, file_category))
                return await cur.fetchone()

    async def save_question(self, contract_id: int, contract_category_id: int, question_detail: str) -> int:
        """질문 저장"""
        if not self.pool:
            raise Exception("MySQL pool이 초기화되지 않았습니다.")
        async with self.pool.acquire() as conn:
            async with conn.cursor() as cur:
                sql = """
                      INSERT INTO question
                          (contract_id, contract_category_id, question_detail, created_at)
                      VALUES (%s, %s, %s, %s) \
                      """
                await cur.execute(sql, (contract_id, contract_category_id, question_detail, datetime.now()))
                return cur.lastrowid

    async def save_contract_clauses(self, contract_id: int, sections: list):
        """계약서 조항들을 저장"""
        if not self.pool:
            raise Exception("MySQL pool이 초기화되지 않았습니다.")

        async with self.pool.acquire() as conn:
            async with conn.cursor() as cur:
                values = []
                for section in sections:
                    # clause_type을 Enum으로 변환
                    clause_type = self._convert_to_clause_type(section.get('type', 'standard'))
                    values.append((
                        contract_id,
                        section.get('number', ''),
                        section.get('title', ''),
                        section.get('content', ''),
                        clause_type.value,
                        datetime.now()
                    ))
                sql = """
                      INSERT INTO clause
                      (contract_id, clause_number, clause_title, clause_content, clause_type, created_at)
                      VALUES (%s, %s, %s, %s, %s, %s) \
                      """
                await cur.executemany(sql, values)
                logger.info(f"계약서 {contract_id}의 조항 저장 완료")

    def _convert_to_clause_type(self, type_str: str) -> ClauseType:
        """문자열을 ClauseType Enum으로 변환"""
        type_mapping = {
            'standard': ClauseType.STANDARD,
            'special': ClauseType.SPECIAL,
        }
        return type_mapping.get(type_str.lower(), ClauseType.STANDARD)


# MySQL 클라이언트 인스턴스 생성
mysql_manager = MySQLManager()
