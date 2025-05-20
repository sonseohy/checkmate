from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import utils.dependencies as deps
from api.endpoints import router
from db.qdrant import qdrant_client
from nlp.embeddings import init_embedding_model
from utils.dependencies import ocr_cache, mysql_manager, mongo_manager
from utils.logging import setup_logger

# 로깅 설정
logger = setup_logger(__name__)

app_state = {
    "collections": None,
    "vector_store": None,
    "is_initialized": False,
}


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("애플리케이션 시작 - DB 연결 초기화")
    try:
        # MySQL 연결
        await mysql_manager.connect()

        # MongoDB 연결
        await mongo_manager.connect()

        # Redis 캐시 연결 (추가)
        await ocr_cache.connect()
        logger.info("Redis 캐시 연결 완료")

        # Qdrant 초기화
        embeddings, embedding_dim = init_embedding_model()
        collection_name = qdrant_client.setup_collection(embedding_dim)
        vector_store = qdrant_client.setup_vector_store(embeddings, collection_name)

        # app state에 vector_store 저장
        app.state.vector_store = vector_store
        deps.vector_store = vector_store

        # 벡터 스토어 상태 확인
        count = vector_store.client.count(
            collection_name=vector_store.collection_name,
            exact=True
        )
        logger.info(f"벡터 DB 내 법률 문서 수: {count.count}")
        logger.info("모든 DB 연결 완료")
    except Exception as e:
        logger.error(f"DB 초기화 실패: {e}")
        raise

    yield

    # Shutdown
    logger.info("애플리케이션 종료 - DB 연결 해제")
    try:
        await mysql_manager.disconnect()
        await mongo_manager.disconnect()
        # Redis 캐시 종료 (추가)
        await ocr_cache.close()
        if qdrant_client.client:
            qdrant_client.client.close()
        logger.info("모든 DB 연결 해제 완료")
    except Exception as e:
        logger.error(f"DB 연결 해제 중 오류: {e}")


# FastAPI 앱 초기화
app = FastAPI(
    title="계약서 분석 및 검토 API",
    description="계약서 작성 및 검토를 도와주는 AI 기반 서비스 API",
    version="1.0.0",
    lifespan=lifespan
)

app.state.vector_store = None

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 운영 환경에서는 구체적인 오리진 지정 필요
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(router, prefix="/api", tags=["contract"])

