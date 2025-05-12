// src/shared/ui/AppLayout.tsx
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Header, HeaderProps } from '@/shared/ui/Header';
import { ChatbotButton } from '@/shared/ui/ChatbotButton';
import { ChatModal } from '@/features/chat';
import { RootState } from '@/app/redux/store';
import { chatService } from '@/features/chat';
export interface AppLayoutProps {
  children: React.ReactNode;
  headerProps?: HeaderProps;
  mainClassName?: string;
}

export const AppLayout = ({
  children,
  headerProps = { className: 'bg-white shadow' },
  mainClassName = ' snap-y snap-mandatory overflow-y-auto',
}: AppLayoutProps) => {
  const mergedHeaderClass = `bg-white shadow ${
    headerProps.className ?? ''
  }`.trim();

  // 🟢 Redux에서 현재 로그인된 유저 ID 가져오기
  const userId =
    useSelector((state: RootState) => state.auth.user?.user_id)?.toString() ??
    null;

  // 🟢 userId가 바뀔 때마다 chatService에 setUser 호출
  useEffect(() => {
    chatService.setUser(userId);
  }, [userId]);

  const [showChat, setShowChat] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <Header
        {...headerProps}
        className={`sticky top-0 z-50 ${mergedHeaderClass}`}
      />
      <main
        className={`flex-1 overflow-y-auto snap-y snap-mandatory ${mainClassName}`}
      >
        {children}
      </main>

      {/* 챗봇 버튼 및 모달 */}
      <ChatbotButton onClick={() => setShowChat(true)} isVisible={!showChat} />
      {showChat && <ChatModal onClose={() => setShowChat(false)} />}
    </div>
  );
};
