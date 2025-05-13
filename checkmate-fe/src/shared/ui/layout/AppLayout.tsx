import { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';

import { Header, HeaderProps } from '@/shared/ui/Header';
import { ChatbotButton } from '@/shared/ui/ChatbotButton';
import { TopButton } from '@/shared/ui/TopButton';
import { useAutoLogout } from '@/shared/hooks/useAutoLogout';

import { ChatModal, chatService } from '@/features/chat';

export interface AppLayoutProps {
  children: React.ReactNode;
  headerProps?: HeaderProps;
  mainClassName?: string;
}

export const AppLayout = ({
  children,
  headerProps = { className: 'bg-white shadow' },
  mainClassName = 'snap-y snap-mandatory overflow-y-auto',
}: AppLayoutProps) => {
  const userId =
    useSelector((state: RootState) => state.auth.user?.user_id)?.toString() ??
    null;

  useEffect(() => {
    chatService.setUser(userId);
  }, [userId]);

  const [showChat, setShowChat] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // 자동 로그아웃 훅
  useAutoLogout(mainRef);

  // Top 버튼 표시용 스크롤 감지
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    const handleScroll = () => {
      setShowTopButton(el.scrollTop > el.clientHeight * 0.5);
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const mergedHeaderClass = `bg-white shadow ${
    headerProps.className ?? ''
  }`.trim();

  return (
    <div className="flex flex-col h-screen relative">
      <Header
        {...headerProps}
        className={`sticky top-0 z-50 ${mergedHeaderClass}`}
      />

      <main
        ref={mainRef}
        className={`flex-1 overflow-y-auto snap-y snap-mandatory ${mainClassName}`}
      >
        {children}
      </main>

      <ChatbotButton onClick={() => setShowChat(true)} isVisible={!showChat} />
      {showChat && <ChatModal onClose={() => setShowChat(false)} />}
      {showTopButton && <TopButton onClick={scrollToTop} />}
    </div>
  );
};
