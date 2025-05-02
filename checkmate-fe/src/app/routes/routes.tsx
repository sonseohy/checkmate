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

// 카카오 로그인 콜백 페이지
const Auth = lazy(() =>
 import('@features/auth/ui/Auth').then(module => ({ default: module.default }))
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

      // 계약서 작성 플로우
      { path: 'write/:mainCategorySlug', element: <WriteCategoryPage /> },
      { path: 'write/:mainCategorySlug/intro', element: <WriteIntroPage /> },
      { path: 'write/:mainCategorySlug/fill', element: <WriteFillPage /> },

      // 계약서 분석 플로우
      { path: 'analyze/:mainCategorySlug', element: <AnalyzeCategoryPage /> },
      {
        path: 'analyze/:mainCategorySlug/upload',
        element: <AnalyzeUploadPage />,
      },
      {
        path: 'analyze/:mainCategorySlug/review',
        element: <AnalyzeReviewPage />,
      },
      {
        path: 'analyze/:mainCategorySlug/result',
        element: <AnalyzeResultPage />,
      },

      // 404 페이지
      { path: '*', element: <NotFoundPage /> },
      //kakao 콜백 페이지
      { path: 'kakao/login', element: <Auth /> },
    ],
  },
]);
