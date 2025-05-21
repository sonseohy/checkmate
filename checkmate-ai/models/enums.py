from enum import Enum


# 중요도 enum 정의 (Spring Boot의 Importance enum과 일치)
class Importance(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


# 위험 수준 enum 정의 (Spring Boot의 RiskLevel enum과 일치)
class RiskLevel(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class ClauseType(str, Enum):
    STANDARD = "STANDARD"  # 한국 표준 조항
    SPECIAL = "SPECIAL"  # 특약 조항
