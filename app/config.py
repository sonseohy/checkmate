import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

class Settings:
    # AES-GCM DEK (Base64 인코딩)
    ENCRYPTION_BASE64_KEY = os.getenv("ENCRYPTION_BASE64_KEY")

    # AWS S3
    AWS_ACCESS_KEY_ID     = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_REGION            = os.getenv("AWS_REGION", "ap-northeast-2")
    S3_BUCKET_NAME        = os.getenv("S3_BUCKET_NAME")

    # MySQL
    MYSQL_HOST     = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT     = int(os.getenv("MYSQL_PORT", 3306))
    MYSQL_USER     = os.getenv("MYSQL_USER")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
    MYSQL_DB       = os.getenv("MYSQL_DB")

    # MongoDB
    MONGODB_HOST     = os.getenv("MONGODB_HOST", "localhost")
    MONGODB_PORT     = int(os.getenv("MONGODB_PORT", 27017))
    MONGODB_DB       = os.getenv("MONGODB_DB")
    MONGODB_USER     = os.getenv("MONGODB_USER")
    MONGODB_PASSWORD = os.getenv("MONGODB_PASSWORD")
    MONGODB_AUTH_DB  = os.getenv("MONGODB_AUTH_DB", "admin")

    # Upstage OCR API
    UPSTAGE_OCR_API_URL = os.getenv("UPSTAGE_OCR_API_URL")
    UPSTAGE_OCR_API_KEY = os.getenv("UPSTAGE_OCR_API_KEY")

settings = Settings()
