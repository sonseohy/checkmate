import { Suspense, lazy } from "react"
import { createBrowserRouter, RouteObject } from "react-router-dom"
import { AppLayout } from "@/shared"

//메인 페이지
const MainPage = lazy(() => import("@pages/main").then((module) => ({ default: module.MainPage })))
//마이 페이지
const MyPage  = lazy(() => import ("@pages/mypage").then((module) =>({ default: module.MyPage})))
// 계약서 작성 페이지
const WritePage   = lazy(() => import("@pages/write").then(module => ({ default: module.WritePage })))
// 계약서 분석 페이지
const AnalyzePage = lazy(() => import("@pages/analyze").then(module => ({ default: module.AnalyzePage })))
// // 로그인 페이지
// const AuthPage    = lazy(() => import("@pages/auth").then(module => ({ default: module.AuthPage })))


const routes: RouteObject[] = [
    {
        path: "/",
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <AppLayout>
                    <MainPage />
                </AppLayout>
            </Suspense>
        )
    },
    {
        path: "/mypage",
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <MyPage />
            </Suspense>
        )
    },  
    {
        path: "/write/:template",
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <WritePage />
            </Suspense>
        )
    },
    {
        path: "/analyze/:template",
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <AnalyzePage />
            </Suspense>
        )
    },
];

export const router = createBrowserRouter(routes);