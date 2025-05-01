# 1단계: 빌드
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# 2단계: nginx로 서빙
FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf

# 빌드된 파일을 nginx가 읽을 위치로 복사
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
