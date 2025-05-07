# 1단계: Vite 빌드
FROM node:18 AS build

WORKDIR /app

# CI에서 전달받은 .env 내용 (전체 문자열)을 ARG로 받음
ARG FRONTEND_ENV
ENV FRONTEND_ENV=${FRONTEND_ENV}

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# 전달받은 환경변수 내용을 .env 파일로 저장
RUN echo "$FRONTEND_ENV" > .env

RUN npm run build

# 2단계: Nginx로 정적 파일 서빙
FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

