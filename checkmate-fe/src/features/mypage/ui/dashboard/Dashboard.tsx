// 대시 보드
import {
  PieDonutChart,
  ContractListData,
  contractList,
  ContractCarousel,
} from '@/features/mypage';
import useMobile from '@/shared/hooks/useMobile';
import { useQuery } from '@tanstack/react-query';

export default function Dashboard() {
  const isMobile = useMobile();

  const { data, isLoading, isError, error } = useQuery<ContractListData, Error>(
    {
      queryKey: ['contractList'],
      queryFn: contractList,
    },
  );

  if (isLoading) {
    return <div>Loading..</div>;
  }

  if (isError) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'An error occurred'}
      </div>
    );
  }
  /* ── 레이아웃 클래스 분기 ── */
  const wrapperCls = isMobile
    ? 'flex flex-col px-4 pt-4 pb-20 gap-6' // ↙️ 모바일: 상단 16px, 하단 80px(바 여유), 가운데 정렬 제거
    : 'flex flex-col ml-10 mt-10 gap-8'; // 데스크톱(기존)

  const cardOuterCls = isMobile ? 'w-full' : 'w-full rounded-2xl';

  return (
    <div className={wrapperCls}>
      {/* ── 최근 활동 ── */}
      <div className={cardOuterCls}>
        <h2
          className={`text-[#202020] font-semibold ${
            isMobile ? 'text-xl mb-3' : 'text-2xl mb-5 ml-5'
          }`}
        >
          최근 활동
        </h2>
        <ContractCarousel contractList={data?.contracts ?? []} />
      </div>

      {/* ── 계약 활동 차트 ── */}
      {isMobile ? (
        <div className="rounded-2xl bg-white w-full">
          <PieDonutChart contractList={data?.contracts ?? []} />
        </div>
      ) : (
        <div className="rounded-2xl bg-white shadow-[0_0px_15px_rgba(0,0,0,0.2)] w-1/4">
          <h2 className="mt-5 ml-5 text-black text-2xl font-semibold">
            계약 활동
          </h2>
          <PieDonutChart contractList={data?.contracts ?? []} />
        </div>
      )}
    </div>
  );
}
