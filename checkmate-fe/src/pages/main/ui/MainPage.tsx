import React from 'react';
import { AppLayout } from '@/shared';

// ✅ default export로 변경
const MainPage = () => {
    return (
      <AppLayout>
        <div className="p-4">메인 콘텐츠</div>
      </AppLayout>
    );
  };
  
  export default MainPage;