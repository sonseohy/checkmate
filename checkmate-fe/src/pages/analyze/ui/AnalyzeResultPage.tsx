import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AnalysisService,
  AnalysisDashboard,
  AnalysisResult,
} from '@/features/analyze';
import { useUserInfo } from '@/features/auth';
import { Spinner } from '@/shared/ui/Spinner';
import uploadImage from '@/assets/images/loading/upload.png';
import {
  getOverallLevel,
  levelLabel,
  levelLottie,
  levelColor,
} from '@/shared/utils/levelUtils';
import Lottie from 'lottie-react'; // ✅ 변경

/* Skeleton 카드 – Dashboard 카드와 높이·둥근모서리 동일 */
const CardSkeleton = () => (
  <div className="h-56 rounded-lg bg-gray-100 animate-pulse" />
);

/* 배너 애니메이션 */
const bannerVar = {
  hidden: { y: -40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 70, damping: 12 },
  },
};

/* 그리드·카드 스태거 */
const gridVar = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};
const cardVar = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const AnalyzeResultPage: React.FC = () => {
  /* URL & 제목 state */
  const { contractId } = useParams<{ contractId: string }>();
  const { state } = useLocation() as { state?: { contractTitle?: string } };

  /* 로그인 사용자 */
  const me = useUserInfo();
  const userName = me?.name ?? '사용자';
  const contractTitle = state?.contractTitle ?? '계약서';

  /* API 상태 */
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  /* 로딩 문구 회전 */
  const [msgIdx, setMsgIdx] = useState(0);
  const msgs = [
    '분석에는 최대 1~2분이 걸릴 수 있어요.',
    '분석이 완료되면 알려드릴게요!',
  ];
  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setMsgIdx((i) => (i + 1) % msgs.length), 5000);
    return () => clearInterval(id);
  }, [loading]);

  /* fetch */
  useEffect(() => {
    if (!contractId) return;
    setLoading(true);
    AnalysisService.getResult(contractId)
      .then(setResult)
      // .catch(console.error)
      .finally(() => setLoading(false));
  }, [contractId]);

  /* 단계 계산 */
  const level = result ? getOverallLevel(result) : 1;
  const stageTxt = levelLabel[level];
  const stageColor = levelColor[level];
  /* showDash: 배너 애니 끝나면 true */
  const [showDash, setShowDash] = useState(false);
  const stageSize = 'text-3xl md:text-4xl';
  return (
    <section className="container px-4 py-16 mx-auto space-y-12">
      <h1 className="text-3xl font-bold text-center">
        <span className="whitespace-nowrap sm:whitespace-normal">
          {result?.categoryName ?? contractTitle}
        </span>{' '}
        분석결과
      </h1>

      {/* 배너 */}
      {!loading && (
        <motion.div
          className="flex flex-row items-center justify-center gap-4 mt-6 
          
          "
          variants={bannerVar}
          initial="hidden"
          animate="visible"
          onAnimationComplete={() => setShowDash(true)}
        >
          <Lottie
            animationData={levelLottie[level]}
            loop={false}
            className="w-24 h-24 md:w-28 md:h-28"
          />

          <p className="text-xl md:text-2xl font-semibold drop-shadow-sm text-center">
            {userName}님의&nbsp;{contractTitle}는
            <br className="md:hidden" />
            <span className={`underline ${stageColor} ${stageSize}`}>
              {stageTxt}
            </span>
            단계입니다
          </p>
        </motion.div>
      )}

      {/* 로딩 화면 */}
      {loading && (
        <div className="flex flex-col items-center justify-center mt-10 space-y-4">
          <img
            src={uploadImage}
            alt="분석 로딩"
            className="w-24 h-24 animate-pulse"
          />
          <Spinner />
          <p className="text-lg font-medium text-gray-700 text-center">
            {msgs[msgIdx]}
          </p>
        </div>
      )}

      {/* 그리드: skeleton → 대시보드로 morph */}
      <motion.div
        className="grid gap-8 md:grid-cols-2"
        variants={gridVar}
        initial="hidden"
        animate={showDash ? 'visible' : 'hidden'}
      >
        {showDash && result ? (
          /* 실제 카드 4개 */
          <AnalysisDashboard
            result={result}
            userName={userName}
            contractTitle={contractTitle}
            cardVar={cardVar}
          />
        ) : (
          /* skeleton 4개 (layout 모핑) */
          Array.from({ length: 4 }).map((_, i) => (
            <motion.div key={i} variants={cardVar} layout>
              <CardSkeleton />
            </motion.div>
          ))
        )}
      </motion.div>

      {/* 실패 시 */}
      {!loading && !result && (
        <p className="text-center text-gray-500">
          분석 결과를 불러오지 못했습니다.&nbsp;
          <button
            className="underline text-blue-600"
            onClick={() => window.location.reload()}
          >
            다시 시도
          </button>
        </p>
      )}
    </section>
  );
};

export default AnalyzeResultPage;
