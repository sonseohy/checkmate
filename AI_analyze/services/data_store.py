from db.mongo import mongo_manager
from db.qdrant import qdrant_client
from nlp.embeddings import init_embedding_model
from utils.logging import setup_logger

logger = setup_logger(__name__)


def init_databases():
    """데이터베이스 초기화 및 설정"""

    # MongoDB 설정
    collections = mongo_manager.connect()

    # 임베딩 모델 초기화
    embeddings, embedding_dim = init_embedding_model()

    # Qdrant 컬렉션 설정
    collection_name = qdrant_client.setup_collection(embedding_dim)

    # 벡터 저장소 설정
    vector_store = qdrant_client.setup_vector_store(embeddings, collection_name)

    # 벡터 저장소 내 문서 수 확인
    try:
        # 벡터 저장소 내 문서 수 확인
        count = vector_store.client.count(
            collection_name=vector_store.collection_name,
            exact=True  # 정확한 카운트를 위해 True로 설정 (선택사항)
        )
        logger.info(f"벡터 DB 내 법률 문서 수: {count.count}")

        if count.count == 0:
            logger.warning("벡터 DB에 법률 문서가 없습니다. legal_document_manager.py를 실행하여 법률 문서를 로드하세요.")
    except Exception as e:
        logger.error(f"벡터 DB 문서 수 확인 오류: {e}")

    return collections, vector_store
