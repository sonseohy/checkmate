import { Header, HeaderProps } from '@/shared/ui/Header';

export interface AppLayoutProps {
  children: React.ReactNode;
  headerProps?: HeaderProps;
  mainClassName?: string;
}

export const AppLayout = ({
  children,
  headerProps,
  mainClassName = '',
}: AppLayoutProps) => (
  <div className="flex flex-col h-screen">
    <Header
      {...headerProps}
      className={`sticky top-0 z-50 ${headerProps?.className ?? ''}`}
    />
 <main
     className={`
       flex-1
       overflow-y-auto
       snap-y snap-mandatory
       ${mainClassName}
     `}
   >


      {children}
    </main>
  </div>
);
