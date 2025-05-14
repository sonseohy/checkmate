from fastapi import Request

from db.mongo import MongoDBManager
from db.mysql import MySQLManager
from db.redis import OCRCache

# 전역 인스턴스 생성
mysql_manager = MySQLManager()
mongo_manager = MongoDBManager()
ocr_cache = OCRCache()
vector_store = None


async def get_mysql() -> MySQLManager:
    """MySQL 의존성"""
    return mysql_manager


async def get_mongo() -> MongoDBManager:
    """MongoDB 의존성"""
    return mongo_manager


async def get_ocr_cache() -> OCRCache:
    """Redis 캐시 의존성"""
    return ocr_cache


async def get_vector_store(request: Request):
    """벡터 스토어 의존성"""
    # app.state에서 가져오기 시도
    if hasattr(request.app.state, 'vector_store') and request.app.state.vector_store is not None:
        return request.app.state.vector_store

    # fallback: dependencies 모듈의 전역 변수 사용
    if vector_store is not None:
        return vector_store

    raise ValueError("Vector store가 초기화되지 않았습니다. 서버가 완전히 시작될 때까지 기다려주세요.")
