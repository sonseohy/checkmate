import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LegalClauseGroup,
  Clause,
  useGenerateContractFile,
  neutralizeOklch,
  prettifyLine,
} from '@/features/write';
import Swal from 'sweetalert2';
import html2pdf from 'html2pdf.js';
import '@/features/write/style/pdf-fix.css';

const WritePreviewPage: React.FC = () => {
  const { state } = useLocation() as {
    state?: {
      contractId: number;
      templateName: string;
      legalClausesBySection: LegalClauseGroup[];
    };
  };

  if (!state?.contractId || !state.legalClausesBySection?.length) {
    return (
      <div className="text-center text-gray-500">
        표시할 계약서 미리보기 내용이 없습니다.
      </div>
    );
  }
  const contractId = state.contractId;
  const templateName = state.templateName ?? '계약서';
  const legalClauses = state.legalClausesBySection;
  const navigate = useNavigate();

  /* PDF 파일 변환 및 저장 */
  const uploadMutation = useGenerateContractFile();

  /** DOM -> PDF -> POST */
  const handlePdfUpload = async () => {
    try {
      const target = document.getElementById('preview-root');
      if (!target) throw new Error('미리보기 영역을 찾지 못했습니다.');

      const fileName = `${templateName}_${contractId}.pdf`;

      const blob: Blob = await html2pdf()
        .from(target)
        .set({
          margin: 10,
          filename: fileName,
          html2canvas: {
            scale: 2,
            onclone: (doc: Document) => neutralizeOklch(doc, '#000'),
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .outputPdf('blob');

      await uploadMutation.mutateAsync({
        contractId,
        pdfBlob: blob,
        fileName,
      });

      Swal.fire('완료', 'PDF가 성공적으로 저장되었습니다.', 'success').then(
        () =>
          navigate(`/detail/${contractId}`, {
            state: {
              contract_id: contractId,
              fileName,
            },
            replace: true,
          }),
      );
    } catch (err) {
      // console.error(err);
      Swal.fire('오류', 'PDF 생성/업로드에 실패했습니다.', 'error');
    }
  };

  /* 날짜(yyyy.MM.dd) */
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '.');

  /* 섹션 정렬 */
  const sortedSections = [...legalClauses].sort(
    (a, b) =>
      (a.legalClauses[0]?.order ?? Infinity) -
      (b.legalClauses[0]?.order ?? Infinity),
  );

  const allOrders = legalClauses
    .flatMap((group) => group.legalClauses.map((c) => c.order ?? Infinity))
    .filter((o) => o !== Infinity)
    .sort((a, b) => a - b);

  const lastTwoOrders = allOrders.slice(-2);
  let currentOrder = 1;

  // SSN 마스킹 함수
  function maskResidentId(raw: string) {
    const m = raw.match(/^(\d{6})(\d)/);
    if (!m) return raw;
    const [, front, firstDigit] = m;
    // 뒤에는 항상 6개의 별을 찍는다
    return `${front}-${firstDigit}${'*'.repeat(6)}`;
  }

  // 각 라인 렌더링 헬퍼
  function renderLine(line: string) {
    // '주민등록번호:' 로 시작하면
    if (/^\s*주민등록번호\s*[:：]/.test(line)) {
      const parts = line.split(/[:：]\s*/);
      const label = parts[0];
      const raw = parts[1] ?? '';
      return `${label}: ${maskResidentId(raw.trim())}`;
    }
    // 그 외는 일반 prettify
    return prettifyLine(line);
  }

  return (
    <div className="container py-16 space-y-10 max-w-3xl mx-auto px-4">
      <div
        id="preview-root"
        className="content-wrapper bg-white p-6 border-2 border-gray-300 space-y-8 print:p-4"
      >
        {/* ===== 타이틀 ===== */}
        <h1 className="text-3xl font-bold text-center mb-10">{templateName}</h1>

        {sortedSections.map((section, idx) => {
          const clauses: Clause[] = [...section.legalClauses].sort(
            (a, b) => (a.order ?? Infinity) - (b.order ?? Infinity),
          );
          const [header, ...others] = clauses;
          const orderNo = header?.order;

          /* 마지막 두 조항은 계약하는 사람들 상세 정보 */
          if (orderNo === lastTwoOrders[0]) {
            const nextClauses = sortedSections[idx + 1]?.legalClauses ?? [];
            return (
              // 묶음 전체를 새 페이지에서 시작하게
              <div
                key={`combined-${section.groupId}`}
                className="section-start-new-page"
              >
                <p className="text-center font-semibold">{today}.</p>
                {[...clauses, ...nextClauses].map((c, i) => (
                  <article key={`${section.groupId}-${c.order ?? i}`}>
                    <h3 className="font-bold mb-2">{c.titleText}</h3>
                    <ul className="pl-5 space-y-1">
                      {c.content.map((line, j) => (
                        <li
                          key={j}
                          className={
                            /^[0-9]+[.)]/.test(line.trim())
                              ? 'list-none pl-0'
                              : 'list-disc list-inside'
                          }
                        >
                          {renderLine(line)}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            );
          }
          if (orderNo === lastTwoOrders[1]) return null;

          /* ── 일반 조항 ── */
          return (
            <article key={section.groupId}>
              {header && header.titleText ? (
                <>
                  <h2 className="font-bold mb-2">
                    제{currentOrder++}조 ({header.titleText})
                  </h2>
                  <ul className="pl-5 space-y-1 mb-4">
                    {header.content.map((line, i) => (
                      <li
                        key={i}
                        className={
                          /^[0-9]+[.)]/.test(line.trim())
                            ? 'list-none pl-0'
                            : 'list-disc list-inside'
                        }
                      >
                        {renderLine(line)}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <ul className="pl-5 space-y-1 mb-4">
                  {header?.content.map((line, i) => (
                    <li
                      key={i}
                      className={
                        /^[0-9]+[.)]/.test(line.trim())
                          ? 'list-none pl-0'
                          : 'list-disc list-inside'
                      }
                    >
                      {renderLine(line)}
                    </li>
                  ))}
                </ul>
              )}

              {others.map((c, i) => (
                <div
                  key={`${section.groupId}-${c.order ?? i}`}
                  className="mb-4"
                >
                  <h3 className="font-semibold mb-1">{c.titleText}</h3>
                  <ul className="pl-5 space-y-1">
                    {c.content.map((line, j) => (
                      <li
                        key={j}
                        className={
                          /^[0-9]+[.)]/.test(line.trim())
                            ? 'list-none pl-0'
                            : 'list-disc list-inside'
                        }
                      >
                        {renderLine(line)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </article>
          );
        })}
      </div>

      <div className="flex justify-center gap-4 mt-12">
        <button
          onClick={handlePdfUpload}
          disabled={uploadMutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {uploadMutation.isPending ? '업로드 중…' : '계약서 저장하기'}
        </button>
      </div>
    </div>
  );
};

export default WritePreviewPage;
