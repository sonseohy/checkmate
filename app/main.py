from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.db.mysql import mysql_manager
from app.db.mongo import mongodb_manager
from app.api.ocr import router as ocr_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await mysql_manager.connect()
    await mongodb_manager.connect()
    yield
    # Shutdown
    await mysql_manager.disconnect()
    await mongodb_manager.disconnect()

app = FastAPI(
    title="Contract Analyzer OCR",
    lifespan=lifespan  # on_event 대신 lifespan
)

# CORS 설정 (개발 중만 "*" 허용, 운영 시 도메인 고정)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(ocr_router, prefix="/ocr", tags=["ocr"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
