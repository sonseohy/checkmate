import { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';

import { Header, HeaderProps } from '@/shared/ui/Header';
import Footer from '@/shared/ui/Footer';
import { ChatbotButton } from '@/shared/ui/ChatbotButton';
import { TopButton } from '@/shared/ui/TopButton';
import { useAutoLogout } from '@/shared/hooks/useAutoLogout';
import { Spinner } from '@/shared/ui/Spinner';

import { ChatModal, chatService } from '@/features/chat';
import { useNavigation } from 'react-router-dom';

export interface AppLayoutProps {
  children: React.ReactNode;
  headerProps?: HeaderProps;
  mainClassName?: string;
}

export const AppLayout = ({
  children,
  headerProps = { className: 'bg-white shadow' },
  mainClassName = '',
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
  const { state } = useNavigation();
  // 자동 로그아웃 - 사용자 활동 감지용 main 영역
  useAutoLogout(mainRef);

  // ✅ Top 버튼 표시용: window 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      const threshold = 200; // 👉 스크롤이 최소 200px 넘었을 때만 보여주자
      setShowTopButton(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const mergedHeaderClass = `bg-white shadow ${
    headerProps.className ?? ''
  }`.trim();

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* 헤더 */}
      <Header
        {...headerProps}
        className={`sticky top-0 z-50 ${mergedHeaderClass}`}
      />

      {/* 콘텐츠 영역 */}
      <main ref={mainRef} className={`flex-grow ${mainClassName}`}>
        {children}
      </main>

      {/* Footer 항상 하단 */}
      <Footer />

      {/* 챗봇 & Top 버튼 */}
      <ChatbotButton onClick={() => setShowChat(true)} isVisible={!showChat} />
      {showChat && <ChatModal onClose={() => setShowChat(false)} />}
      {showTopButton && <TopButton onClick={scrollToTop} />}
      {/* ---------- 페이지 전환 오버레이 ---------- */}
      {state === 'loading' && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <Spinner size="lg" />
        </div>
      )}
    </div>
  );
};
