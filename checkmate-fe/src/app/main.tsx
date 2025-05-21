// src/main.tsx

// pdfjs.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.mjs`;
// pdfjs.GlobalWorkerOptions.workerSrc = `${window.location.origin}${import.meta.env.BASE_URL}pdf.worker.mjs`;
// pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdf.worker.mjs', window.location.origin).toString();

// import pdfWorkerURL from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerURL;
// console.log(pdfWorkerURL);
// (async () => {
//   const { pdfjs } = await import("react-pdf");
//   pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//     "pdfjs-dist/build/pdf.worker.mjs",
//     import.meta.url
//   ).toString();
// })();

// console.log('pdfjs workerSrc:', pdfjs.GlobalWorkerOptions.workerSrc);

import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import '@app/styles/index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/routes/routes';
import { Provider } from 'react-redux';
import { store } from '@/app/redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

import { FullPageSpinner } from '@/shared/ui/Spinner';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<FullPageSpinner />}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />

          <ToastContainer />
        </QueryClientProvider>
      </Provider>
    </Suspense>
  </StrictMode>,
);
