// src/pages/NotFoundPage.tsx
import React from "react"
import { Link } from "react-router-dom"

const NotFoundPage: React.FC = () => (
  <div className="container py-32 mx-auto text-center">
    <h1 className="mb-4 text-5xl font-bold">404</h1>
    <p className="mb-8 text-xl">죄송합니다. 요청하신 페이지를 찾을 수 없습니다.</p>
    <Link
      to="/"
      className="inline-block px-6 py-3 text-white bg-blue-600 rounded hover:bg-blue-700"
    >
      메인으로 돌아가기
    </Link>
  </div>
)

export default NotFoundPage