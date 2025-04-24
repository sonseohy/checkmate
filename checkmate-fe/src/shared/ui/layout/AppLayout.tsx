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
       pt-16            /* 일반 padding-top: 헤더 높이만큼 */
       scroll-pt-16     /* scroll-padding-top: 스냅 기준을 헤더 아래로 */
       ${mainClassName}
     `}
   >


      {children}
    </main>
  </div>
);
