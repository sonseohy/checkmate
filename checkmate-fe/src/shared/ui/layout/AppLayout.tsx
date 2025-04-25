import { Header, HeaderProps } from '@/shared/ui/Header';

export interface AppLayoutProps {
  children: React.ReactNode;
  headerProps?: HeaderProps;
  mainClassName?: string;
}

export const AppLayout = ({
  children,
  // headerProps가 없으면 빈 객체를, className은 'bg-white shadow'를 기본값으로
  headerProps = { className: 'bg-white shadow' },
  mainClassName = 'px-4 snap-y snap-mandatory overflow-y-auto',
}: AppLayoutProps) => {
  // headerProps.className이 이미 있으면 뒤에 추가, 없으면 기본값만
  const mergedHeaderClass = `bg-white shadow ${headerProps.className ?? ''}`.trim();

  return (
    <div className="flex flex-col h-screen">
      <Header
        {...headerProps}
        className={`sticky top-0 z-50 ${mergedHeaderClass}`}
      />
      <main className={`flex-1 overflow-y-auto snap-y snap-mandatory ${mainClassName}`}>
        {children}
      </main>
    </div>
  );
};