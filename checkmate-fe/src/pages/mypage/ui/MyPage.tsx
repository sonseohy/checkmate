import {
  SideBar,
  Dashboard,
  UserInfo,
  CourtLocator,
  MyContracts,
  useGeolocation,
} from '@/features/mypage';
import { NotificationList, useNotifications } from '@/features/notifications';
import { useMobile } from '@/shared';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function MyPage() {
  useGeolocation();
  const isMobile = useMobile();
  const [params] = useSearchParams();
  const initialMenu =
    params.get('tab') === 'notifications' ? '알림' : '대시보드';

  const [selectedMenu, setSelectedMenu] = useState<string>(initialMenu);
  const { notifications } = useNotifications();
  const handleMenuClick = (label: string) => {
    setSelectedMenu(label);
  };

  let displayComponent;
  switch (selectedMenu) {
    case '대시 보드':
      displayComponent = <Dashboard />;
      break;
    case '내 계약서':
      displayComponent = <MyContracts />;
      break;
    case '알림':
      displayComponent = (
        <NotificationList variant="page" notifications={notifications} />
      );
      break;
    case '주변 법원':
      displayComponent = <CourtLocator />;
      break;
    case '회원 정보':
      displayComponent = <UserInfo />;
      break;
    default:
      displayComponent = <Dashboard />;
  }

  return (
    <div>
      {isMobile ? (
        <div className="flex flex-col min-h-screen">
          {/* 사이드바 */}
          <div className="flex-shrink-0  z-4">
            <SideBar
              onMenuClick={handleMenuClick}
              selectedMenu={selectedMenu}
            />
          </div>
          <div className="flex-1 bg-[#F3F4F6]">
            <div className="h-px bg-gray-200 " />
            {/* 컴포넌트 */}
            <div className="m-3">{displayComponent}</div>
          </div>
        </div>
      ) : (
        <div className="flex flex-row min-h-screen">
          {/* 사이드바 */}
          <div className="flex-shrink-0">
            <SideBar
              onMenuClick={handleMenuClick}
              selectedMenu={selectedMenu}
            />
          </div>
          <div className="flex-1 bg-[#F3F4F6]">
            <div className="h-px bg-gray-200 " />
            {/* 컴포넌트 */}
            <div className="m-3">{displayComponent}</div>
          </div>
        </div>
      )}
    </div>
  );
}
