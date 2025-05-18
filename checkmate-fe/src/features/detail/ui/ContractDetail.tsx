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

  /* URL 파라미터 + state */
  const { contractId: paramId } = useParams<{ contractId: string }>();
  const { state } = useLocation() as { state?: ContractSummary };

  const id = Number(paramId); // 질문 리스트 조회용
  const contract = state ?? null; // 요약 정보(옵션)

  const [questions, setQuestions] = useState<questionList>({ question: [] });

  /* 질문 리스트 fetch */
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

  /* ─── 렌더 가드 ─── */
  if (!id) return <p className="p-4">잘못된 접근입니다.</p>;

  /* ─── 화면 ─── */
  const category = categories.find((c) => c.id === contract?.category_id);

  return (
    <div>
      {/* ── 상단 요약 ── */}
      {contract ? (
        <div className={isMobile ? '' : 'my-5'}>
          <p className="font-semibold text-2xl mb-2">{contract.title}</p>
          <p className="text-lg">
            카테고리&nbsp;:&nbsp;{category?.name ?? contract.category_id}
          </p>
        </div>
      ) : (
        <div className="my-4 text-gray-500">제목·카테고리 정보 없음</div>
      )}

      <div className="h-px bg-gray-200" />

      {/* ── 질문 리스트 ── */}
      <div className="mt-3">
        <div className="font-medium text-xl mb-2">질문 리스트</div>

        {questions.question.length === 0 ? (
          <p className="text-lg">질문 리스트가 존재하지 않습니다.</p>
        ) : (
          <ul className="space-y-1">
            {questions.question.map((q) => (
              <li key={q.questionId}>
                <span className="font-semibold">Q.</span> {q.questionDetail}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ContractDetail;
