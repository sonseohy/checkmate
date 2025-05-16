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

const WritePreviewPage: React.FC = () => {
  const { state } = useLocation() as {
    state?: {
      contractId: number;
      templateName: string;
      legalClausesBySection: LegalClauseGroup[];
    };
  };

  if (
    !state?.legalClausesBySection ||
    state.legalClausesBySection.length === 0
  ) {
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

      const res = await uploadMutation.mutateAsync({
        contractId,
        pdfBlob: blob,
        fileName,
      });

      Swal.fire('완료', 'PDF가 성공적으로 저장되었습니다.', 'success').then(
        () =>
          navigate(`/detail/${contractId}`, {
            state: {
              contract_id: contractId,
              fileName: res.fileName ?? '',
            },
            replace: true,
          }),
      );
    } catch (err) {
      console.error(err);
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

  return (
    <div className="container py-16 mx-auto print:py-10">
      <h1 className="text-3xl font-bold text-center mb-10 print:text-2xl print:mb-6">
        계약서 미리보기
      </h1>

      <div className="max-w-3xl mx-auto space-y-10 print:space-y-6">
        {sortedSections.map((section, index) => {
          const sortedClauses: Clause[] = [...section.legalClauses].sort(
            (a, b) => {
              const orderA = typeof a.order === 'number' ? a.order : Infinity;
              const orderB = typeof b.order === 'number' ? b.order : Infinity;
              return orderA - orderB;
            },
          );

          const [headerClause, ...otherClauses] = sortedClauses;
          const orderNumber = headerClause?.order;

          /* ── 15+16조 합치기 ── */
          if (orderNo === 15) {
            const nextClauses = sortedSections[idx + 1]?.legalClauses ?? [];

            return (
              <>
                <div className="text-center text-gray-700 font-bold text-xl mb-6 print:text-base print:mb-4">
                  {today}.
                </div>
                <div
                  key={`combined-${section.sectionId}`}
                  className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm print:shadow-none print:p-4 print:break-inside-avoid"
                >
                  {[...sortedClauses, ...nextClauses].map((clause, i) => (
                    <div key={i} className="mb-6">
                      <h3 className="font-bold text-lg print:text-base mb-2">
                        {clause.titleText}
                      </h3>
                      <ul className="pl-5 text-gray-700 print:text-sm">
                        {clause.content.map((line, j) => (
                          <li
                            key={j}
                            className={
                              /^[0-9]+[.)]/.test(line.trim())
                                ? 'list-none pl-0'
                                : 'list-disc list-inside'
                            }
                          >
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </>
            );
          }
          if (orderNo === 16) return null;

          /* ── 일반 조항 ── */
          return (
            <article key={section.groupId}>
              {header && (
                <>
                  <h2 className="text-xl font-bold print:text-lg">
                    제{headerClause.order ?? '-'}조(
                    {headerClause.titleText ?? '제목 없음'})
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
                        {line.replace(
                          /금\s?(\d{1,})(원정|원)/g,
                          (_, amount, suffix) => {
                            return `금 ${Number(
                              amount,
                            ).toLocaleString()}${suffix}`;
                          },
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {otherClauses.map((clause, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-lg font-semibold print:text-base">
                    {clause.titleText}
                  </h3>
                  <ul className="pl-5 text-gray-700 print:text-sm">
                    {clause.content.map((line, i) => (
                      <li
                        key={i}
                        className={
                          /^[0-9]+[.)]/.test(line.trim())
                            ? 'list-none pl-0'
                            : 'list-disc list-inside'
                        }
                      >
                        {prettifyLine(line)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </article>
          );
        })}
      </div>

      {/* ===== 버튼 영역 ===== */}
      <div className="flex justify-center gap-4 mt-12">
        <button
          onClick={handlePdfUpload}
          disabled={uploadMutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {uploadMutation.isPending ? '업로드 중…' : 'PDF 저장하기'}
        </button>
      </div>
    </div>
  );
};

export default WritePreviewPage;
