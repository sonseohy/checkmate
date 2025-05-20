import { Bell } from 'lucide-react';
import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { markAsRead as markDotOff } from '@/features/notifications/model/notificationSlice';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import NotificationList from './NotificationList';

interface Props {
  open: boolean;
  onClick: () => void;
  onItemClick?: () => void;
}

const NotificationButton: React.FC<Props> = ({
  open,
  onClick,
  onItemClick,
}) => {
  const dispatch = useDispatch();
  const hasNew = useSelector((s: RootState) => s.notifications.hasNew);

  /* React-Query hooks (목록, 변이) */
  const { notifications, markAllAsRead } = useNotifications();

  const ref = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    onClick(); // 드롭다운 토글

    /* 빨간 점 제거 + 서버/캐시 모두 읽음 */
    if (hasNew) {
      dispatch(markDotOff());
      markAllAsRead(); // PUT /read-all
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleClick}
        className="flex items-center text-gray-600 hover:text-black relative"
      >
        <Bell size={20} />
        {hasNew && (
          <>
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping" />
          </>
        )}
      </button>

      {open && (
        <div
          className="
            fixed top-14 left-1/2 -translate-x-1/2
            md:absolute md:top-auto md:right-0 md:left-auto md:translate-x-0
            z-50 mt-2
          "
        >
          <NotificationList
            variant="popup"
            notifications={notifications}
            onItemClick={onItemClick}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationButton;
