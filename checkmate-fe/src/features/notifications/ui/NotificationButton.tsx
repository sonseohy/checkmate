import { Bell } from 'lucide-react';
import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { markAsRead } from '../model/notificationSlice';

export const NotificationButton = () => {
  const dispatch = useDispatch();
  const hasNew = useSelector((state: RootState) => state.notifications.hasNew);
  const [open, setOpen] = useState(false);
  const notifications = useSelector(
    (state: RootState) => state.notifications.list,
  );
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setOpen((prev) => !prev);
    dispatch(markAsRead());
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

      {/* 기존 알림 드롭다운 */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-md z-50">
          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">
              받은 알림이 없습니다.
            </div>
          ) : (
            <ul className="max-h-64 overflow-y-auto">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className="px-4 py-2 border-b text-sm hover:bg-gray-50"
                >
                  {n.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
