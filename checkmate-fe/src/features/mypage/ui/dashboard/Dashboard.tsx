// src/features/mypage/ui/Dashboard.tsx
import {
  PieDonutChart,
  ContractListData,
  contractList,
  ContractCarousel,
} from '@/features/mypage';
import useMobile from '@/shared/hooks/useMobile';
import { useQuery } from '@tanstack/react-query';
import UnreadCard from './UnreadCard';
import { useUserInfo } from '@/features/auth';
import { getColorFromString } from '@/shared/utils/getColorFromString';

export default function Dashboard() {
  const isMobile = useMobile();
  const user = useUserInfo();
  const userName = user?.name ?? '회원';
  const userColor = getColorFromString(userName);
  const { data, isLoading, isError, error } = useQuery<ContractListData, Error>(
    { queryKey: ['contractList'], queryFn: contractList },
  );

  if (isLoading) return <div>Loading…</div>;
  if (isError)
    return <div>Error: {error instanceof Error ? error.message : 'Error'}</div>;

  /* 카드 높이(제목 제외) */
  const chartAreaH = isMobile ? 300 : 400;

  /* wrapper */
  const wrapperCls = isMobile
    ? 'flex flex-col px-4 pt-4 pb-20 gap-6'
    : 'flex flex-col px-10 pt-10 gap-10';

  return (
    <div className={wrapperCls}>
      {/* 🌟 사용자 타이틀 */}
      <h1
        className={`font-bold text-[#202020] ${
          isMobile ? 'text-2xl mb-2' : 'text-3xl mb-4'
        }`}
      >
        <span style={{ color: userColor }}>{userName}</span>
        님의 대시보드
      </h1>

      {/* ── 1행: 계약 활동 + 읽지 않은 알림 ── */}
      <div className={isMobile ? 'flex flex-col gap-6' : 'flex gap-8'}>
        {/* 계약 활동 카드 */}
        <div
          className={`flex-1 flex flex-col rounded-2xl bg-white overflow-visible
                       
                         ${
                           isMobile ? '' : 'shadow-[0_0px_15px_rgba(0,0,0,0.1)]'
                         }`}
        >
          <h2 className="mt-5 ml-5 text-black text-2xl font-semibold shrink-0">
            계약 활동
          </h2>
          <div className="flex-1" style={{ minHeight: chartAreaH }}>
            <PieDonutChart contractList={data?.contracts ?? []} />
          </div>
        </div>

        {/* 읽지 않은 알림 카드 */}
        <div className="flex-1">
          <UnreadCard minHeight={chartAreaH} />
        </div>
      </div>

      {/* ── 2행: 최근 활동 캐러셀 ── */}
      <div className="w-full">
        <h2
          className={`text-[#202020] font-semibold ${
            isMobile ? 'text-xl mb-3' : 'text-2xl mb-5'
          }`}
        >
          최근 활동
        </h2>
        <ContractCarousel contractList={data?.contracts ?? []} />
      </div>
    </div>
  );
}
