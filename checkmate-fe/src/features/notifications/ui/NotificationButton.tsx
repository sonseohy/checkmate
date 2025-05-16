import { Bell } from 'lucide-react';
import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { markAsRead } from '@/features/notifications/model/notificationSlice';
import NotificationList from './NotificationList';
import { useNotifications } from '../hooks/useNotifications';

interface NotificationButtonProps {
  open: boolean;
  onClick: () => void;
}

export const NotificationButton = ({
  open,
  onClick,
}: NotificationButtonProps) => {
  const dispatch = useDispatch();
  const hasNew = useSelector((state: RootState) => state.notifications.hasNew);
  const { notifications } = useNotifications();

  const ref = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    onClick(); // 부모가 관리하는 상태 토글
    if (hasNew) dispatch(markAsRead());
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleClick}
        className="flex items-center text-gray-600 hover:text-black relative"
      >
        <Bell size={20} />
        {hasNew && (
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 z-50">
          <NotificationList notifications={notifications} />
        </div>
      )}
    </div>
  );
};
