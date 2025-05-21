import { Contract } from '@/features/mypage/model/types';
import { useMemo, useState } from 'react';
import './ContractTable.css';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { LuDownload } from 'react-icons/lu';
import { getContractownload } from '@/features/detail';
import { getCategorName, useMobile } from '@/shared';

interface ContractTableProps {
  rowData: Contract[];
  selectedIds: Set<number>;
  toggleSelect: (id: number) => void;
  toggleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ROW_PER_PAGE = 10;

const ContractTable: React.FC<ContractTableProps> = ({
  rowData,
  selectedIds,
  toggleSelect,
  toggleSelectAll,
}) => {
  const isMobile = useMobile();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);

  /* 최신순 정렬된 배열 */
  const sortedRows = useMemo(() => {
    return [...rowData].sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );
  }, [rowData]);

  /*  페이지네이션 */
  const pageCount = Math.ceil(sortedRows.length / ROW_PER_PAGE);
  const offset = currentPage * ROW_PER_PAGE;
  const currentRows = sortedRows.slice(offset, offset + ROW_PER_PAGE);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  // 다운로드
  const handlePdfDownload = (row: Contract) => {
    const categoryName = row.category_id
      ? getCategorName(Number(row.category_id))
      : '제목을 입력하세요';
    const fileName = `${categoryName}.pdf`;
    getContractownload(row.contract_id, fileName);
  };

  return (
    <div className="p-0 overflow-x-hidden">
      <table className="w-full mb-0 border-t border-b border-[#e2e8f0] text-[#4a5568] table-fixed">
        <thead className="bg-[#F5F5F5]">
          <tr className="align-bottom">
            <th
              className={`table-head-ceil text-center ${
                isMobile ? 'w-5' : ' w-8'
              }`}
            >
              <input
                type="checkbox"
                className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`}
                checked={selectedIds.size === rowData.length}
                onChange={toggleSelectAll}
              />
            </th>
            <th
              className={`table-head-ceil text-center ${
                isMobile ? 'w-5' : ' w-5'
              }`}
            >
              분류
            </th>
            <th
              className={`table-head-ceil text-center ${
                isMobile ? 'w-9' : ' w-18'
              }`}
            >
              계약서 명
            </th>
            <th
              className={`table-head-ceil text-center ${
                isMobile ? 'w-9' : ' w-10'
              }`}
            >
              상태
            </th>
            <th
              className={`table-head-ceil text-center ${
                isMobile ? 'w-10' : ' w-12'
              }`}
            >
              최종 수정일
            </th>
            <th className="table-head-ceil w-8 text-center">다운로드</th>
          </tr>
        </thead>
        <tbody className={`table-body text-center ${isMobile ? 'w-5' : 'w-8'}`}>
          {currentRows.map((row) => {
            const isWritten = row.source_type === 'SERVICE_GENERATED';
            const isCompleted = row.edit_status === 'COMPLETED';
            return (
              <tr
                className="hover:cursor-pointer"
                key={row.contract_id}
                onClick={(e) => {
                  // 체크박스를 클릭한 경우에는 navigate를 막음
                  if (e.target instanceof HTMLInputElement) {
                    e.stopPropagation(); // 체크박스를 클릭하면 navigate 방지
                    return;
                  }

                  // isCompleted에 따라 navigate 경로 변경
                  if (
                    row.source_type === 'SERVICE_GENERATED' &&
                    row.edit_status === 'COMPLETED'
                  ) {
                    navigate(`/detail/${row.contract_id}`, {
                      state: { contract: row },
                    });
                  } else if (
                    row.source_type === 'SERVICE_GENERATED' &&
                    row.edit_status === 'EDITING'
                  ) {
                    navigate(`/write/edit/${row.contract_id}`, {
                      state: { contract: row },
                    });
                  } else if (
                    row.source_type === 'USER_UPLOAD' &&
                    row.edit_status === 'COMPLETED'
                  ) {
                    navigate(`/analyze/result/${row.contract_id}`, {
                      state: row,
                    });
                  }
                }}
              >
                <td className="table-ceil text-center">
                  <input
                    type="checkbox"
                    className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`}
                    checked={selectedIds.has(row.contract_id)}
                    onChange={(e) => {
                      e.stopPropagation(); // 체크박스 클릭 시 tr 클릭 방지
                      toggleSelect(row.contract_id);
                    }}
                  />
                </td>
                <td className="table-ceil text-center">
                  <span
                    className={`inline-block font-bold rounded
                      ${isMobile ? 'p-1 ' : 'px-3 py-1 text-sm'}
                      ${
                        row.source_type === 'USER_UPLOAD'
                          ? 'bg-[#B4C7FF] text-[#3053B4]'
                          : 'bg-[#FFB4B5] text-[#991B33]'
                      }
                    `}
                  >
                    {isWritten ? '작성' : '분석'}
                  </span>
                </td>
                <td className="table-ceil text-center text-[#202020]">
                  {isWritten ? `${row.title}` : '분석 계약서'}
                </td>
                <td className="table-ceil text-center">
                  <span
                    className={`inline-block px-3 py-1 font-bold uppercase rounded
                      ${row.edit_status === 'COMPLETED' ? '' : 'text-[#999999]'}
                    `}
                  >
                    {row.source_type === 'USER_UPLOAD'
                      ? row.edit_status === 'COMPLETED'
                        ? '분석 완료'
                        : '분석중'
                      : row.edit_status === 'COMPLETED'
                      ? '작성 완료'
                      : '작성중'}
                  </span>
                </td>
                <td className="table-ceil text-center text-[#202020]">
                  {new Date(row.updated_at).toLocaleDateString()}
                </td>
                <td className="table-ceil text-center">
                  {isCompleted ? (
                    <LuDownload
                      className="mx-auto"
                      size={isMobile ? 20 : 30}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePdfDownload(row);
                      }}
                    />
                  ) : (
                    <LuDownload
                      size={isMobile ? 20 : 30}
                      color="white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePdfDownload(row);
                      }}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* 페이지네이션 */}
      <div className="pagenation-wrapper">
        <ReactPaginate
          previousLabel={'← 이전'}
          nextLabel={'다음 →'}
          breakLabel={'...'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          pageClassName={'page-item'}
          previousClassName={'previous-item'}
          nextClassName={'next-item'}
        />
      </div>
    </div>
  );
};

export default ContractTable;
