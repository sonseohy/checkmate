import { Bell } from 'lucide-react';
import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { markAsRead } from '../model/notificationSlice';
import NotificationList from './NotificationList'; // ✅ 새 UI 컴포넌트

export const NotificationButton = () => {
  const dispatch = useDispatch();
  const hasNew = useSelector((state: RootState) => state.notifications.hasNew);
  const notifications = useSelector(
    (state: RootState) => state.notifications.list,
  );
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setOpen((prev) => !prev);
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

      {/* ✅ 알림 드롭다운 UI */}
      {open && (
        <div className="absolute right-0 mt-2 z-50">
          <NotificationList notifications={notifications} />
        </div>
      )}
    </div>
  );
};
