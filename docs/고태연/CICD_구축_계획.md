## CI/CD 구축 단계 설계

### 1. 기본 인프라

항목 | 설치 목적
Docker | 모든 서비스를 컨테이너화하기 위한 기반
Docker Compose | 멀티 서비스 구동을 쉽게
Nginx | 리버스 프록시 및 HTTPS
Certbot | Let’s Encrypt SSL 인증서 자동 갱신
Git & Jenkins | CI/CD 파이프라인 구성
Node.js / Java 17+ | 프론트 빌드, 스프링 구동

### 2. 데이터베이스 & 캐시 구성

1. MySQL (RDB)

- 주 데이터 저장소
- Docker로 실행: mysql:8.0

2. MongoDB (NoSQL)

- 비정형/JSON 기반 저장소
- Docker로 실행: mongo:6

3. Redis

- 세션, 캐시, 메시지 큐
- Docker로 실행: redis:7

4. VectorDB (예: Qdrant, Weaviate, Milvus)

- AI 검색용 벡터 임베딩 저장소
- Docker로 실행 (Qdrant 추천): qdrant/qdrant

### 3. 백엔드 & 프론트엔드 구성

백엔드(Spring Boot) 구성
- Spring Boot 3.x + Spring Security + JWT
- DB 연동 설정 (MySQL, Mongo, Redis, VectorDB API)
- Health Check 및 메트릭용: Spring Boot Actuator
- 빌드 후 Docker로 컨테이너화

프론트엔드 구성 (React, TypeScript, TailwindCSS)
- PWA 설정 포함
- 빌드 결과 (npm run build)를 nginx에서 서비스
- Docker로 컨테이너화


### 4. CI/CD (Jenkins or GitHub Actions)
프론트
- Lint → Build → Docker Build/Push

백엔드
- Test → Build (Gradle) → Docker Build/Push

공통
- 이미지 → DockerHub or ECR
- 배포 스크립트로 docker-compose pull & up

### 5. Nginx + HTTPS
리버스 프록시로
    - /api → Spring Boot
    - / → React

- Certbot으로 Let’s Encrypt SSL 자동 인증서 적용

### 6. 모니터링
- Grafana + Prometheus
- Spring Boot Actuator 메트릭 수집
- Docker 컨테이너 모니터링 (cadvisor 등)
- Elasticsearch + Kibana (옵션)
- 로그 분석 및 시각화