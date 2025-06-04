# ✔️ 체크메이트

#### 📌 프로젝트 소개
체크메이트는 계약서를 손쉽게 작성하고 작성한 계약서를 업로드하면 LLM을 통해 분석해주는 서비스입니다.

#### 🗓️ 수행 기간
2025.04.14 ~ 2025.05.22

-----

# 👩‍💻 개발 환경
### Frontend
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white"/> <img src="https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=Typescript&logoColor=white"/> <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=Tailwind%20CSS&logoColor=white"/> <br />

### Backend
<img src="https://img.shields.io/badge/SpringBoot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"/> <img src="https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white"/> <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"/> <img src="https://img.shields.io/badge/ClamAV-0079C1?style=for-the-badge"/> <img src="https://img.shields.io/badge/AES--GCM-000000?style=for-the-badge&logo=lock&logoColor=white"/> <br />

### AI
<img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white"/> <img src="https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=LangChain&logoColor=white"/> <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white"/> <br />

### Database
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white"/> <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/> <img src="https://img.shields.io/badge/Redis-FF4438?style=for-the-badge&logo=redis&logoColor=white"/> <img src="https://img.shields.io/badge/Qdrant-000000?style=for-the-badge"/> <br />

### Infra/DevOps
<img src="https://img.shields.io/badge/EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white"/> <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"/> <img src="https://img.shields.io/badge/AWS%20S3-569A31?style=for-the-badge&logo=Amazon%20S3&logoColor=white"/> <img src="https://img.shields.io/badge/CloudFront-232F3E?style=for-the-badge&logo=Amazon%20CloudFront&logoColor=white"/> <img src="https://img.shields.io/badge/GitLab%20Runner-FC6D26?style=for-the-badge&logo=gitlab&logoColor=white"/> <br />

### Tools
<img src="https://img.shields.io/badge/Mattermost-0058CC?style=for-the-badge&logo=mattermost&logoColor=white"/> <img src="https://img.shields.io/badge/GitLab-FC6D26?style=for-the-badge&logo=gitlab&logoColor=white"/> <br />

-----

# 📋 기능 요약

- **계약서 템플릿으로 계약서 작성**: 업무 유형별 사전 검증된 표준 템플릿으로 필수 항목만 입력하면 완성된 계약서 생성
- **계약서 바이러스 검사**: 계약서를 업로드 하면 ClamAV를 통해 바이러스 검사
- **계약서 분석**: 계약서를 AI를 이용해 요약, 위험조항, 누락조항, 개선사항을 생성
- **계약 질문리스트 생성**: 계약서 기준으로 AI를 통해 계약하기 전 질문리스트 생성
- **전자서명을 통한 전자문서 인증**: API를 통해 전자서명 인증 
- **실시간 알림**: 전자서명 완료, 분석완료, 질문리스트 생성이 완료 시 알림

-----

# 🔧 설계

### 시스템 아키텍처
![image](docs/images/architecture.png)

<br/>

### ERD
![erd](docs/images/ERD.jpg)

-----

# 🎯 주요 화면 및 기능 소개

#### 메인화면

| 메인화면 | 뉴스 (모바일) |
| :---: | :---: |
| <img src="docs/images/mainpage.gif" width="300" /> | <img src="docs/images/mobile_news.gif" width="300" /> |

#### 계약서 분석

| 업로드 | 업로드 (모바일) |
| :---: | :---: |
| <img src="docs/images/analysis_upload.gif" width="300" /> | <img src="docs/images/mobile_analysis_upload.gif" width="300" /> |

| 분석 결과 | 실시간 알림 및 분석 결과 (모바일) |
| :---: | :---: |
| <img src="docs/images/analysis_result.gif" width="300" /> | <img src="docs/images/mobile_analysis_result.gif" width="300" /> |

#### 계약서 작성 가이드

| 작성 가이드 |
| :---: |
| <img src="docs/images/writing_guide.gif" width="300" /> |

#### 계약서 작성 전 주의사항

| 작성 전 주의 사항 | 작성 전 주의사항 (모바일) |
| :---: | :---: |
| <img src="docs/images/pre_writing_precautions.gif" width="300" /> | <img src="docs/images/mobile_pre_writing_precautions.gif" width="300" /> |

#### 계약서 작성

| 계약서 작성 | 계약서 작성 (모바일) | 질문리스트 (모바일) |
| :---: | :---: | :---: |
| <img src="docs/images/contract_creation.gif" width="300" /> | <img src="docs/images/mobile_contract_creation.gif" width="300" /> | <img src="docs/images/mobile_question_list.gif" width="300" />  |

#### 마이페이지

| 마이페이지 | 분석페이지 |
| :---: | :---: |
| <img src="docs/images/mypage.gif" width="300" /> | <img src="docs/images/mypage_analysis_result.gif" width="300" /> |

| 법원 | 법원 (모바일) |
| :---: | :---: |
| <img src="docs/images/court.gif" width="300" /> | <img src="docs/images/mobile_court.gif" width="300" /> |

#### 계약서 저장

| 계약서 저장 | 계약서 저장 (모바일) |
| :---: | :---: |
| <img src="docs/images/final_contract.gif" width="300" /> | <img src="docs/images/mobile_final_contract.gif" width="300" /> |

#### 전자서명
| 전자서명 |
| :---: |
| <img src="docs/images/electronic_signature.gif" width="300" /> |

-----   

# 🥳 팀원
| 이영재(팀장) | 손서현 | 신승아 | 송창현 | 김성찬 | 고태연 |
| :---: | :---: | :---: | :---: | :---: | :---: |
| BE<br/>AI | BE | FE | FE | BE<br/>AI | FE<br/>DevOps |
<br/>