import { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { ContractSummary } from '@/features/detail';
import { categories, useMobile } from '@/shared';
import { useQuestions } from '@/features/detail/hooks/useQuestions';
import { useNotificationSocket } from '@/features/notifications';
import { useUserInfo } from '@/features/auth';

const ContractDetail: React.FC = () => {
  const isMobile = useMobile();

  /* URL */
  const { contractId: paramId } = useParams<{ contractId: string }>();
  const { state } = useLocation() as { state?: ContractSummary };
  const id = Number(paramId);
  const contract = state ?? null;

  /* 질문 쿼리 */
  const { data: questions } = useQuestions(id);

  /* “AI 완료” 플래그 */
  const [aiDone, setAiDone] = useState(false);

  /* WebSocket 알림 구독 (로그인 사용자만) */
  const user = useUserInfo();
  useNotificationSocket(!!user, (n) => {
    if (n.type === 'QUESTION_GENERATION' && n.contract_id === id) {
      setAiDone(true);
    }
  });

  if (!id) return <p className="p-4">잘못된 접근입니다.</p>;
  const categoryName = categories.find(
    (c) => c.id === contract?.category_id,
  )?.name;

  /* 로딩 상태: 질문이 없고 AI 완료 전이면 무조건 로딩 */
  const showLoading =
    (!questions || questions.question.length === 0) && !aiDone;

  return (
    <div className="flex flex-col h-full">
      {/* ─ 제목 & 카테고리 ─ */}
      {contract && (
        <header className={isMobile ? 'mb-2' : 'mb-3'}>
          <h1 className="text-2xl font-bold">{contract.title}</h1>
          {categoryName && (
            <p className="text-sm text-gray-600 mt-1">
              카테고리 · {categoryName}
            </p>
          )}
        </header>
      )}

      {/* ─ 질문 섹션 ─ */}
      <section className="flex-1 overflow-y-auto rounded-lg p-4 bg-white no-scrollbar">
        <p className="text-center text-2xl text-gray-800 mb-4">
          계약 전,&nbsp;
          <span className="font-semibold text-blue-600">꼭! 물어볼 질문</span>
        </p>

        {/* ① 로딩 스켈레톤 */}
        {showLoading && (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <svg
              className="animate-spin h-10 w-10 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>

            <p className="text-gray-500 text-base">
              AI가 질문을 생성하고 있습니다
              <span className="dot dot1">.</span>
              <span className="dot dot2">.</span>
              <span className="dot dot3">.</span>
            </p>

            <ul className="w-full max-w-md space-y-3">
              {[1, 2, 3].map((i) => (
                <li key={i} className="h-6 bg-gray-200 rounded animate-pulse" />
              ))}
            </ul>
          </div>
        )}

        {/* ② AI 완료 & 질문 없음 */}
        {!showLoading && questions && questions.question.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-6 text-center">
            <p className="text-gray-500">질문이 생성되지 않았습니다.</p>
          </div>
        )}

        {/* ③ 결과 */}
        {!showLoading && questions && questions.question.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {questions.question.map((q, idx) => (
              <li key={q.questionId} className="p-3 hover:bg-gray-50">
                <div className="flex items-baseline">
                  <span className="text-blue-600 font-medium text-base mr-2 shrink-0">
                    {idx + 1}.
                  </span>
                  <p className="text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {q.questionDetail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ContractDetail;
