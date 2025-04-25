import { Suspense, lazy } from "react"
import { createBrowserRouter, RouteObject } from "react-router-dom"
import { AppLayout } from "@/shared"

//메인 페이지
const MainPage = lazy(() => import("@pages/main").then((module) => ({ default: module.MainPage })))
//마이 페이지
const MyPage  = lazy(() => import ("@pages/mypage").then((module) =>({ default: module.MyPage})))

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
    }
];

export const router = createBrowserRouter(routes);