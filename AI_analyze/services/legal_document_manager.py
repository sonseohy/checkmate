# legal_document_manager.py
import argparse

from db.qdrant import qdrant_client
from nlp.embeddings import init_embedding_model
from services.legal_document_loader import LegalDocumentsProcessor
from utils.logging import setup_logger

logger = setup_logger(__name__)


def init_vector_store():
    """벡터 스토어 초기화"""
    # 임베딩 모델 초기화
    embeddings, embedding_dim = init_embedding_model()

    # Qdrant 컬렉션 설정
    collection_name = qdrant_client.setup_collection(embedding_dim)

    # 벡터 저장소 설정
    vector_store = qdrant_client.setup_vector_store(embeddings, collection_name)

    return vector_store


def load_and_store_legal_documents():
    """법률 문서 로드 및 저장"""
    logger.info("법률 문서 로드 및 저장 시작")

    # 벡터 스토어 초기화
    vector_store = init_vector_store()

    # 자동 로더 사용
    processor = LegalDocumentsProcessor("data/legal_documents")
    processor.process_and_store_documents()

    # 벡터 저장소 내 문서 수 확인
    count = vector_store.client.count(
        collection_name=vector_store.collection_name,
        exact=True  # 정확한 카운트를 위해 True로 설정 (선택사항)
    )
    logger.info(f"벡터 DB 총 문서 수: {count.count}")

    return len(processor.all_documents)


def main():
    """메인 함수"""
    parser = argparse.ArgumentParser(description="법률 문서 벡터 DB 관리 도구")
    parser.add_argument("--load", action="store_true", help="법률 문서 로드 및 저장")
    parser.add_argument("--clear", action="store_true", help="벡터 DB 초기화 (모든 데이터 삭제)")

    args = parser.parse_args()

    if args.clear:
        # 벡터 스토어 초기화
        vector_store = init_vector_store()
        # 모든 데이터 삭제
        vector_store.collection.delete(filters={})
        logger.info("벡터 DB 초기화 완료 (모든 데이터 삭제됨)")

    if args.load or not args.clear:
        # 법률 문서 로드 및 저장
        load_and_store_legal_documents()


if __name__ == "__main__":
    main()
