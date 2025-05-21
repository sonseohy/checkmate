
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
