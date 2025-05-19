/* src/features/detail/ui/ContractDetail.tsx */
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  getContractQuestions,
  questionList,
  ContractSummary,
} from '@/features/detail';
import { categories, useMobile } from '@/shared';

const ContractDetail: React.FC = () => {
  const isMobile = useMobile();

  /* URL 파라미터 + state -------------------------------------------------- */
  const { contractId: paramId } = useParams<{ contractId: string }>();
  const { state } = useLocation() as { state?: ContractSummary };

  const id = Number(paramId);
  const contract = state ?? null;

  /* 질문 리스트 ----------------------------------------------------------- */
  const [questions, setQuestions] = useState<questionList>({ question: [] });

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const q = await getContractQuestions(id);
        setQuestions(q);
      } catch (e) {
        console.error('질문 리스트 불러오기 실패:', e);
      }
    })();
  }, [id]);

  if (!id) return <p className="p-4">잘못된 접근입니다.</p>;

  const categoryName = categories.find(
    (c) => c.id === contract?.category_id,
  )?.name;

  /* ─────────────────────────── UI ─────────────────────────── */
  return (
    <div className="flex flex-col h-full">
      {/* ▸ 제목 & 카테고리 (있을 때만) */}
      {contract && (
        <header className={`${isMobile ? 'mb-2' : 'mb-3'}`}>
          <h1 className="text-2xl font-bold">{contract.title}</h1>
          {categoryName && (
            <p className="text-sm text-gray-600 mt-1">
              카테고리 · {categoryName}
            </p>
          )}
        </header>
      )}

      {/* ▸ 질문 섹션 - 부모 컨테이너의 높이에 맞추기 */}
      <section className="flex-1 overflow-y-auto rounded-lg p-4 bg-white no-scrollbar ">
        {/* ▸ 안내 문구 - 체크메이트 문구로 변경 */}
        <p className="text-center text-2xl text-gray-800 mb-2">
          계약 전,&nbsp;
          <span className="font-semibold text-blue-600">꼭! 물어볼 질문</span>
        </p>

        {questions.question.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-6 text-center">
            <p className="text-gray-500">분석 중입니다. 잠시만 기다려주세요.</p>
          </div>
        ) : (
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
