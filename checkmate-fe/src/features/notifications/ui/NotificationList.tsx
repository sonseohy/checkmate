import { useState } from 'react';
import { formatDistanceToNowStrict, isBefore, subDays, format } from 'date-fns';
import { Notification } from '@/features/notifications';
import { ko } from 'date-fns/locale';

type NotificationType = 'ALL' | 'SIGNATURE_COMPLETED' | 'CONTRACT_ANALYSIS';

interface Props {
  notifications: unknown; // 💡 안전을 위해 any 대신 unknown 사용
}

const TABS: { type: NotificationType; label: string }[] = [
  { type: 'ALL', label: '전체' },
  { type: 'SIGNATURE_COMPLETED', label: '전자서명' },
  { type: 'CONTRACT_ANALYSIS', label: '분석결과' },
];

const NotificationList: React.FC<Props> = ({ notifications }) => {
  const [selectedType, setSelectedType] = useState<NotificationType>('ALL');

  // ✅ 배열이 아닌 경우 대비
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  const filtered =
    selectedType === 'ALL'
      ? safeNotifications
      : safeNotifications.filter((n) => n.type === selectedType);

  const formatDate = (iso: string) => {
    const createdDate = new Date(iso);
    const now = new Date();
    const isWithin24Hours = isBefore(subDays(now, 1), createdDate);

    return isWithin24Hours
      ? `${formatDistanceToNowStrict(createdDate, { locale: ko })} 전`
      : format(createdDate, 'yyyy.MM.dd');
  };

  return (
    <div className="w-[400px] bg-white rounded-lg shadow-md p-4">
      {/* 탭 */}
      <div className="flex space-x-4 border-b border-gray-200 pb-2 mb-3">
        {TABS.map((tab) => (
          <button
            key={tab.type}
            className={`text-sm font-semibold ${
              selectedType === tab.type
                ? 'text-black border-b-2 border-blue-500'
                : 'text-gray-400'
            }`}
            onClick={() => setSelectedType(tab.type)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 알림 목록 */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {filtered.map((n) => (
          <a key={n.id} href={n.target_url} className="block">
            <div className="text-sm text-gray-800 line-clamp-2">
              {n.message}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {formatDate(n.created_at)}
            </div>
          </a>
        ))}
        {filtered.length === 0 && (
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
