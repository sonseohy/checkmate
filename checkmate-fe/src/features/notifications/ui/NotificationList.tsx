import { useState } from 'react';
import { format, formatDistanceToNowStrict, isBefore, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Notification } from '@/features/notifications';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';

type Tab = 'ALL' | 'SIGNATURE_COMPLETED' | 'CONTRACT_ANALYSIS';

interface Props {
  notifications: Notification[];
}

const TABS: { type: Tab; label: string }[] = [
  { type: 'ALL', label: '전체' },
  { type: 'SIGNATURE_COMPLETED', label: '전자서명' },
  { type: 'CONTRACT_ANALYSIS', label: '분석결과' },
];

const NotificationList: React.FC<Props> = ({ notifications }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Tab>('ALL');

  /* 개별 읽음 변이 */
  const { markAsRead } = useNotifications();

  const list =
    selected === 'ALL'
      ? notifications
      : notifications.filter((n) => n.type === selected);

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    return isBefore(subDays(now, 1), d)
      ? `${formatDistanceToNowStrict(d, { locale: ko })} 전`
      : format(d, 'yyyy.MM.dd');
  };

  const handleClick = (n: Notification) => {
    if (!n.read) markAsRead(n.id); // 개별 읽음 처리

    if (n.type === 'CONTRACT_ANALYSIS')
      navigate(`/analyze/result/${n.contract_id}`);
    else if (n.type === 'SIGNATURE_COMPLETED')
      navigate(`/detail/${n.contract_id}`);
  };

  return (
    <div
      className="w-[90vw] max-w-xs md:w-[400px] bg-white rounded-lg shadow-lg p-4
            max-h-[75vh] overflow-y-auto"
    >
      {/* 탭 */}
      <div className="flex space-x-4 border-b border-gray-200 pb-2 mb-3">
        {TABS.map((t) => (
          <button
            key={t.type}
            className={`text-sm font-semibold ${
              selected === t.type
                ? 'text-black border-b-2 border-blue-500'
                : 'text-gray-400'
            }`}
            onClick={() => setSelected(t.type)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 리스트 */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {list.map((n) => (
          <div
            key={n.id}
            onClick={() => handleClick(n)}
            className={`block cursor-pointer p-2 rounded hover:bg-gray-50 ${
              n.read ? 'opacity-70' : ''
            }`}
          >
            <div className="text-sm text-gray-800 line-clamp-2">
              {n.message}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {fmtDate(n.created_at)}
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <div className="text-sm text-gray-400 text-center py-4">
            알림이 없습니다
          </div>
        )}
      </div>

      {/* 전체보기 */}
      <div className="mt-4 text-right">
        <a
          href="/mypage?tab=notifications"
          className="text-sm text-blue-600 font-semibold"
        >
          알림 전체 보기
        </a>
      </div>
    </div>
  );
};

export default NotificationList;
