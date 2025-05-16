import { useLocation } from 'react-router-dom';
import { LegalClauseGroup, Clause } from '@/features/write';

const WritePreviewPage: React.FC = () => {
  const { state } = useLocation() as {
    state: {
      contractId: number;
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

  const today = new Date().toISOString().split('T')[0].replace(/-/g, '.');

  const sortedSections = [...state.legalClausesBySection].sort((a, b) => {
    const orderA = a.legalClauses[0]?.order ?? Infinity;
    const orderB = b.legalClauses[0]?.order ?? Infinity;
    return orderA - orderB;
  });

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

          if (orderNumber === 15) {
            const nextSection = sortedSections[index + 1];
            const nextClauses = nextSection?.legalClauses ?? [];
            return (
              <div key={`combined-${section.sectionId}`}>
                <div className="text-center text-gray-700 font-bold text-xl mb-6 print:text-base print:mb-4">
                  {today}.
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm print:shadow-none print:p-4 print:break-inside-avoid">
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
              </div>
            );
          }

          if (orderNumber === 16) return null;

          return (
            <section
              key={section.sectionId}
              className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm space-y-4 print:shadow-none print:p-4 print:break-inside-avoid"
            >
              {headerClause ? (
                <>
                  <h2 className="text-xl font-bold print:text-lg">
                    제{headerClause.order ?? '-'}조(
                    {headerClause.titleText ?? '제목 없음'})
                  </h2>
                  <ul className="pl-5 text-gray-700 print:text-sm">
                    {headerClause.content.map((line, i) => (
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
                          (_, amount, suffix) =>
                            `금 ${Number(amount).toLocaleString()}${suffix}`,
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-gray-400">조항이 없습니다.</p>
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
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          );
        })}
      </div>

      {/* ✅ 버튼 영역 */}
      <div className="text-center mt-12 space-x-4 print:hidden">
        <button
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          onClick={() => window.print()}
        >
          PDF 다운로드
        </button>
      </div>
    </div>
  );
};

export default WritePreviewPage;
