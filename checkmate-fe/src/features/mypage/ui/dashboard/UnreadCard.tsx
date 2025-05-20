/* features/mypage/ui/UnreadCard.tsx */
import { useNotifications } from '@/features/notifications';
import { Notification } from '@/features/notifications';
import alarmImg from '@/assets/images/loading/alarm.png';
import { useNavigate } from 'react-router-dom';
import { format, formatDistanceToNowStrict, isBefore, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Props {
  minHeight: number;
}

export default function UnreadCard({ minHeight }: Props) {
  const navigate = useNavigate();
  const { notifications, markAsRead } = useNotifications();

  // 최대 4개, 미확인 우선 정렬
  const unread = notifications
    .filter((n) => !n.read)
    .sort((a, b) => Number(b.created_at > a.created_at))
    .slice(0, 4);

  /* 날짜 포맷 (NotificationList와 동일) */
  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return isBefore(subDays(new Date(), 1), d)
      ? `${formatDistanceToNowStrict(d, { locale: ko })} 전`
      : format(d, 'yyyy.MM.dd');
  };

  /* 클릭 핸들러 (NotificationList 로직 재사용) */
  const handleClick = (n: Notification) => {
    if (!n.read) markAsRead(n.id);

    if (n.message.includes('실패')) return; // 실패 알림은 이동 없음

    if (n.type === 'CONTRACT_ANALYSIS') {
      navigate(`/analyze/result/${n.contract_id}`);
    } else if (
      n.type === 'SIGNATURE_COMPLETED' ||
      n.type === 'QUESTION_GENERATION'
    ) {
      navigate(`/detail/${n.contract_id}`);
    }
  };

  return (
    <div className="flex flex-col rounded-2xl bg-white shadow-[0_0px_15px_rgba(0,0,0,0.1)] w-full">
      {/* 제목 */}
      <h2 className="mt-5 ml-5 text-black text-2xl font-semibold shrink-0">
        읽지 않은 알림
      </h2>

      {/* 본문 */}
      <div
        className="flex-1 flex items-center justify-center text-center"
        style={{ minHeight }}
      >
        {unread.length === 0 ? (
          /* 빈 상태 */
          <div className="flex flex-col gap-3">
            <img src={alarmImg} alt="no alarm" className="w-24 opacity-80" />
            <p className="text-gray-400 text-base">새 알림이 없습니다</p>
          </div>
        ) : (
          /* 요약 알림 리스트 */
          <ul className="h-full w-full overflow-y-auto p-4 space-y-3 text-left">
            {unread.map((n) => (
              <li
                key={n.id}
                onClick={() => handleClick(n)}
                className={`p-3 rounded cursor-pointer hover:bg-sky-50 ${
                  n.read ? 'opacity-70' : 'bg-sky-50'
                }`}
              >
                <p className="text-sm text-gray-800 line-clamp-2">
                  {n.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {fmtDate(n.created_at)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
