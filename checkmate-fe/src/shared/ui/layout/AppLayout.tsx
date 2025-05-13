import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Header, HeaderProps } from '@/shared/ui/Header';
import { ChatbotButton } from '@/shared/ui/ChatbotButton';
import { ChatModal } from '@/features/chat';
import { RootState } from '@/app/redux/store';
import { chatService } from '@/features/chat';
import { TopButton } from '@/shared/ui/TopButton'; // 경로는 상황에 맞게 수정

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
  const mergedHeaderClass = `bg-white shadow ${
    headerProps.className ?? ''
  }`.trim();

  const userId =
    useSelector((state: RootState) => state.auth.user?.user_id)?.toString() ??
    null;

  useEffect(() => {
    chatService.setUser(userId);
  }, [userId]);

  const [showChat, setShowChat] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // 🟡 main 요소 기준으로 스크롤 감지
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    const handleScroll = () => {
      setShowTopButton(el.scrollTop > el.clientHeight * 0.5);
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  // ⬆️ Section1로 스크롤 이동
  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

      {/* 챗봇 버튼 */}
      <ChatbotButton onClick={() => setShowChat(true)} isVisible={!showChat} />
      {showChat && <ChatModal onClose={() => setShowChat(false)} />}

      {/* Top 버튼 */}
      {showTopButton && <TopButton onClick={scrollToTop} />}
    </div>
  );
};
