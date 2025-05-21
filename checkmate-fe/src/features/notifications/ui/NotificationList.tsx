import { useState } from 'react';
import { format, formatDistanceToNowStrict, isBefore, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Notification } from '@/features/notifications';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';

/* ────────────────────────── 타입 · 상수 ────────────────────────── */
export type Variant = 'popup' | 'page';

type Tab =
  | 'ALL'
  | 'SIGNATURE_COMPLETED'
  | 'CONTRACT_ANALYSIS'
  | 'QUESTION_GENERATION';

const TABS: { type: Tab; label: string }[] = [
  { type: 'ALL', label: '전체' },
  { type: 'SIGNATURE_COMPLETED', label: '전자서명' },
  { type: 'CONTRACT_ANALYSIS', label: '분석결과' },
  { type: 'QUESTION_GENERATION', label: '질문리스트' },
];

interface Props {
  notifications: Notification[];
  variant?: Variant;
  onItemClick?: () => void;
}

/* ────────────────────────── 컴포넌트 ────────────────────────── */
const NotificationList: React.FC<Props> = ({
  notifications,
  variant = 'popup',
  onItemClick,
}) => {
  const navigate = useNavigate();
  const { markAsRead } = useNotifications(); // 공통 훅
  const [selected, setSelected] = useState<Tab>('ALL');

  /* ▼ 필터링 */
  const list =
    selected === 'ALL'
      ? notifications
      : notifications.filter((n) => n.type === selected);

  /* ▼ 날짜 포맷 */
  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return isBefore(subDays(new Date(), 1), d)
      ? `${formatDistanceToNowStrict(d, { locale: ko })} 전`
      : format(d, 'yyyy.MM.dd');
  };

  /* ▼ 클릭 내비게이션 */
  const handleClick = (n: Notification) => {
    /* 1) 아직 안 읽었다면 읽음 표시 */
    if (!n.read) markAsRead(n.id);

    /* 2) 메시지에 ‘실패’가 포함되면 이동하지 않음 */
    if (n.message.includes('실패')) {
      onItemClick?.();
      return;
    }

    /* 3) 정상 알림이면 타입별 라우팅 */
    if (n.type === 'CONTRACT_ANALYSIS') {
      navigate(`/analyze/result/${n.contract_id}`);
    } else if (
      n.type === 'SIGNATURE_COMPLETED' ||
      n.type === 'QUESTION_GENERATION'
    ) {
      navigate(`/detail/${n.contract_id}`);
    }

    onItemClick?.(); // 페이지 이동 후에도 팝업 닫기
  };

  /* ▼ variant 에 따른 스타일 */
  const isPopup = variant === 'popup';
  /* ▼ 글꼴 사이즈 – 팝업·페이지 구분 */
  const msgSize = isPopup ? 'text-sm' : 'text-lg'; // 메시지(본문)
  const dateSize = isPopup ? 'text-xs' : 'text-base'; // 생성일시
  // const tabSize = isPopup ? 'text-sm' : 'text-lg'; // 탭 라벨

  const outerCls = isPopup
    ? `w-[90vw] max-w-xs md:w-[400px] bg-white rounded-lg shadow-lg p-4
       max-h-[75vh] overflow-y-auto`
    : `bg-white rounded-lg p-6          
             mx-5 md:mx-8 lg:mx-10         
             lg:mt-6 lg:mb-8`;

  const listMaxH = isPopup ? 'max-h-64' : 'max-h-[70vh]';

  return (
    <div className={outerCls}>
      <div
        className={`
    flex space-x-3 sm:space-x-4
    overflow-x-auto sm:overflow-visible no-scrollbar
    border-b border-gray-200 pb-2 mb-4
  `}
      >
        {TABS.map((t) => (
          <button
            key={t.type}
            onClick={() => setSelected(t.type)}
            /* ↓ 글자 크기 · 줄바꿈 방지 추가 */
            className={`
        ${isPopup ? 'text-sm' : 'text-base sm:text-lg'}
        whitespace-nowrap font-semibold
        ${
          selected === t.type
            ? 'text-black border-b-2 border-blue-500'
            : 'text-gray-400'
        }
      `}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* ── 알림 목록 ─────────────────────────── */}
      <div
        className={`${listMaxH} overflow-y-auto no-scrollbar
                     divide-y divide-gray-200 space-y-0`}
      >
        {list.map((n) => (
          <div
            key={n.id}
            onClick={() => handleClick(n)}
            className={`p-3 cursor-pointer rounded ${
              n.read
                ? 'opacity-70 hover:bg-gray-50'
                : 'bg-sky-50 hover:bg-sky-100'
            }`}
          >
            {/* ─ 메시지 ─ */}
            <p className={`${msgSize} text-gray-800 line-clamp-2`}>
              {n.message}
            </p>
            {/* ─ 날짜 ─ */}
            <p className={`${dateSize} text-gray-400 mt-1`}>
              {fmtDate(n.created_at)}
            </p>
          </div>
        ))}

        {list.length === 0 && (
          <p className={`${msgSize} py-6 text-center text-gray-400`}>
            알림이 없습니다
          </p>
        )}
      </div>
      {/* ── 하단 액션 (variant 별) ───────────────── */}
      {isPopup && (
        <div className="mt-4 text-right">
          <a
            href="/mypage?tab=notifications"
            className="text-sm text-blue-600 font-semibold"
          >
            알림 전체 보기
          </a>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
