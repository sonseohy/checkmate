import { Header, HeaderProps } from '@/shared/ui/Header';

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
    </div>
  );
};
