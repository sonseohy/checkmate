import { Suspense, lazy } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { AppLayout } from '@/shared';

//메인 페이지
const MainPage = lazy(() =>
  import('@pages/main').then((module) => ({ default: module.MainPage })),
);
//마이 페이지
const MyPage = lazy(() =>
  import('@pages/mypage').then((module) => ({ default: module.MyPage })),
);
// 계약서 작성 페이지
const WriteCategoryPage = lazy(() =>
  import('@pages/write').then((module) => ({
    default: module.WriteCategoryPage,
  })),
);
const WriteIntroPage = lazy(() =>
  import('@pages/write').then((module) => ({ default: module.WriteIntroPage })),
);
const WriteFillPage = lazy(() =>
  import('@pages/write').then((module) => ({ default: module.FillPage })),
);

// 계약서 분석 페이지
const AnalyzeCategoryPage = lazy(() =>
  import('@pages/analyze').then((module) => ({
    default: module.AnalyzeCategoryPage,
  })),
);
const AnalyzeUploadPage = lazy(() =>
  import('@pages/analyze').then((m) => ({ default: m.AnalyzeUploadPage })),
);
const AnalyzeReviewPage = lazy(() =>
  import('@pages/analyze').then((m) => ({ default: m.AnalyzeCorrectionPage })),
);
const AnalyzeResultPage = lazy(() =>
  import('@pages/analyze').then((m) => ({ default: m.AnalyzeResultPage })),
);

//404 페이지
const NotFoundPage = lazy(() =>
  import('@pages/notfound').then((module) => ({
    default: module.NotFoundPage,
  })),
);
export const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <AppLayout>
          <Outlet />
        </AppLayout>
      </Suspense>
    ),
    children: [
      { index: true, path: '/', element: <MainPage /> },
      { path: 'mypage', element: <MyPage /> },

      // 계약서 쓰기 플로우
      { path: 'write/:mainCategoryId', element: <WriteCategoryPage /> }, // 대분류 선택 후 중분류 선택
      {
        path: 'write/:mainCategoryId/:midCategoryId',
        element: <WriteCategoryPage />,
      }, // 중분류 선택 후 소분류 선택
      {
        path: 'write/:mainCategoryId/:midCategoryId/:subCategoryId/intro',
        element: <WriteIntroPage />,
      }, // 소분류 선택 완료
      {
        path: 'write/:mainCategoryId/:midCategoryId/:subCategoryId/fill',
        element: <WriteFillPage />,
      },

      // 계약서 분석 플로우
      { path: 'analyze/:mainCategoryId', element: <AnalyzeCategoryPage /> },
      {
        path: 'analyze/:mainCategoryId/:midCategoryId',
        element: <AnalyzeCategoryPage />,
      }, // 중분류 선택 후 소분류 선택
      {
        path: 'analyze/:mainCategoryId/:midCategoryId/:subCategoryId/upload',
        element: <AnalyzeUploadPage />,
      },
      {
        path: 'analyze/:mainCategoryId/:midCategoryId/:subCategoryId/review',
        element: <AnalyzeReviewPage />,
      },
      {
        path: 'analyze/:mainCategoryId/:midCategoryId/:subCategoryId/result',
        element: <AnalyzeResultPage />,
      },

      // 404 페이지
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

// const routes: RouteObject[] = [
//     {
//         path: "/",
//         element: (
//             <Suspense fallback={<div>Loading...</div>}>
//                 <AppLayout>
//                     <MainPage />
//                 </AppLayout>
//             </Suspense>
//         )
//     },
//     {
//         path: "/mypage",
//         element: (
//             <Suspense fallback={<div>Loading...</div>}>
//                 <MyPage />
//             </Suspense>
//         )
//     },
//     {
//         path: "/write/:template",
//         element: (
//             <Suspense fallback={<div>Loading...</div>}>
//                 <AppLayout>
//                 <WritePage />
//                 </AppLayout>
//             </Suspense>
//         )
//     },
//     {
//         path: "/analyze/:template",
//         element: (
//             <Suspense fallback={<div>Loading...</div>}>
//                                                 <AppLayout>
//                 <AnalyzePage />
//                 </AppLayout>

//             </Suspense>
//         )
//     },
// ];

// export const router = createBrowserRouter(routes);
