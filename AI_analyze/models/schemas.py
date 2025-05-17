from typing import List, Dict, Optional

from pydantic import BaseModel, Field


# 분석 설정 모델
class AnalysisConfig(BaseModel):
    temperature: float = Field(default=0.0, description="모델 temperature")


class OcrRequest(BaseModel):
    contract_id: int
    contract_category_id: Optional[int] = 1


# 계약서 조항 정의
class ContractSection(BaseModel):
    number: str = Field(description="조항 번호")
    title: str = Field(description="조항 제목")
    content: str = Field(description="조항 전체 내용")
    type: str = Field(description="조항 유형")


# 계약서 메타데이터 정의
class ContractMetadata(BaseModel):
    title: str = Field(description="계약서 제목")
    date: str = Field(description="계약 날짜")
    parties: List[Dict[str, str]] = Field(description="계약 당사자 정보")
    contract_type: str = Field(description="계약서 유형")


# 구조화된 계약서 정의
class StructuredContract(BaseModel):
    contract_id: int = Field(description="계약서 ID")
    metadata: ContractMetadata = Field(description="계약서 메타데이터")
    sections: List[ContractSection] = Field(description="계약서 조항 목록")


# 요청 모델
class ContractAnalysisRequest(BaseModel):
    contract_text: str
    contract_id: Optional[int] = None
    contract_category_id: Optional[int] = None

class QuestionGenerationRequest(BaseModel):
    contract_id: int
    contract_category_id: Optional[int] = 1
