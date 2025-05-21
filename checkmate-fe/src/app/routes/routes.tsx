import { Suspense, lazy } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { AppLayout } from '@/shared';
import { ScrollToTop } from '@/shared/utils/ScrollToTop';

//메인 페이지
const MainPage = lazy(() =>
  import('@pages/main').then((module) => ({ default: module.MainPage })),
);
//마이 페이지
const MyPage = lazy(() =>
  import('@pages/mypage').then((module) => ({ default: module.MyPage })),
);
const DetailPage = lazy(() =>
  import('@pages/detail').then((module) => ({ default: module.DetailPage })),
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
  import('@pages/write').then((module) => ({ default: module.WriteFillPage })),
);

const WriteEditPage = lazy(() =>
  import('@pages/write').then((module) => ({ default: module.WriteEditPage })),
);

const WritePreviewPage = lazy(() =>
  import('@pages/write').then((module) => ({
    default: module.WritePreviewPage,
  })),
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
// const AnalyzeReviewPage = lazy(() =>
//   import('@pages/analyze').then((m) => ({ default: m.AnalyzeCorrectionPage })),
// );
const AnalyzeResultPage = lazy(() =>
  import('@pages/analyze').then((m) => ({ default: m.AnalyzeResultPage })),
);

const ErrorPageWrapper = lazy(() =>
  import('@pages/error').then((m) => ({ default: m.ErrorPageWrapper })),
);

const ErrorPage = lazy(() =>
  import('@pages/error/ui/ErrorPage').then((m) => ({ default: m.default })),
);
// 카카오 로그인 콜백 페이지
const Auth = lazy(() =>
  import('@features/auth/ui/Auth').then((module) => ({
    default: module.default,
  })),
);

export const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <AppLayout>
          <ScrollToTop />
          <Outlet />
        </AppLayout>
      </Suspense>
    ),
    children: [
      { index: true, path: '/', element: <MainPage /> },
      { path: 'mypage', element: <MyPage /> },
      // 계약서 상세 조회
      { path: 'detail/:contractId', element: <DetailPage /> },

      // 계약서 작성 가이드
      { path: 'intro/write', element: <WriteIntroPage /> },

      // 계약서 작성 플로우
      { path: 'write/:mainCategorySlug', element: <WriteCategoryPage /> },
      // 신규 작성
      {
        path: 'write/:mainCategorySlug/:categoryId',
        element: <WriteFillPage />,
      },
      // 이어서 작성
      { path: 'write/edit/:contractId', element: <WriteEditPage /> },
      { path: 'contract/:contractId/preview', element: <WritePreviewPage /> },

      // 계약서 분석 플로우
      { path: 'analyze/:mainCategorySlug', element: <AnalyzeCategoryPage /> },
      {
        path: 'analyze/:mainCategorySlug/upload',
        element: <AnalyzeUploadPage />,
      },

      {
        path: 'analyze/result/:contractId',
        element: <AnalyzeResultPage />,
      },

      { path: 'error', element: <ErrorPageWrapper /> },
      { path: '*', element: <ErrorPage /> },
      //kakao 콜백 페이지
      { path: '/login', element: <Auth /> },
    ],
  },
]);
