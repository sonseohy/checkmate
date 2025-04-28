## CI/CD 1일차
### EC2 서버 확보 및 연결
1. ufw 포트 설정
- 기존 포트 + 활용 할 포트 연결 (8080, 5173 등..)
    피드백 => nginx를 활용하면 열지 않아도 된다
2. Docker 설치
- ubuntu에 Docker 설치 완료
3. 프로젝트 코드 업로드
- S12P31C103 코드 업로드 완료
4. 프론트엔드 배포
- index.html 파일만 배포하기 위해, 따로 Dockerfile을 만들지 않고 nginx만 활용해서 배포 완료
- 아직 자동 배포는 X
    피드백 => Dockerfile을 활용하는게 더 편리하다
5. 백엔드 배포
- Dockerfile 작성
- build 과정에서 에러 발생 -> .jar 파일 관련 에러
    => 추가 확인 필요