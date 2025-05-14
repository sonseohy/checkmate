import { Contract } from '@/features/mypage/model/types';
import { useState } from 'react';
import './ContractTable.css';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { LuDownload } from "react-icons/lu";
import { getContractownload } from '@/features/detail';

interface ContractTableProps {
  rowData: Contract[];
  selectedIds: Set<number>;
  toggleSelect: (id: number) => void;
  toggleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ROW_PER_PAGE = 10;

const ContractTable: React.FC<ContractTableProps> = ({ rowData, selectedIds, toggleSelect, toggleSelectAll }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);

  // 페이지네이션 로직
  const pageCount = Math.ceil(rowData.length / ROW_PER_PAGE);
  const offset = currentPage * ROW_PER_PAGE;
  const currentRows = rowData.slice(offset, offset + ROW_PER_PAGE);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  // 다운로드
  const handlePdfDownload = (id: number) => { 
    getContractownload(id);
  };

  return (
    <div className='p-0 overflow-x-hidden'>
      <table className='w-full mb-0 border-t border-b border-[#e2e8f0] text-[#4a5568] table-fixed'>
        <thead className='bg-[#F5F5F5]'>
          <tr className='align-bottom'>
            <th className='table-head-ceil w-8 text-center'>
              <input
                type="checkbox"
                className="w-5 h-5"
                checked={selectedIds.size === rowData.length}
                onChange={toggleSelectAll}
              />
            </th>
            <th className='table-head-ceil w-5 text-center'>분류</th>
            <th className='table-head-ceil w-18 text-center'>계약서 명</th>
            <th className='table-head-ceil w-10 text-center'>작성 상태</th>
            <th className='table-head-ceil w-12 text-center'>최종 수정일</th>
            <th className='table-head-ceil w-8 text-center'>다운로드</th>
          </tr>
        </thead>
        <tbody className='table-body w-8 text-center'>
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
                  if (isCompleted) {
                    navigate(`/detail/${row.contract_id}`, { state: { contract: row } });
                  } else {
                    navigate(`/write/contract/${row.contract_id}`, { state: { contract: row } });
                  }
                }}
              >
                <td className='table-ceil text-center'>
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={selectedIds.has(row.contract_id)}
                    onChange={(e) => {
                      e.stopPropagation(); // 체크박스 클릭 시 tr 클릭 방지
                      toggleSelect(row.contract_id);
                    }}
                  />
                </td>
                <td className="table-ceil text-center">
                  <span
                    className={`inline-block px-3 py-1 text-sm font-bold uppercase rounded
                      ${row.source_type === 'USER_UPLOAD'
                      ? 'bg-[#B4C7FF] text-[#3053B4]'
                      : 'bg-[#FFB4B5] text-[#991B33]'}
                    `}
                  >
                    {isWritten ? '작성' : '분석'}
                  </span>
                </td>
                <td className='table-ceil text-center text-[#202020]'>{row.title}</td>
                <td className='table-ceil text-center'>
                  <span
                    className={`inline-block px-3 py-1 text-[19px] font-bold uppercase rounded
                      ${row.edit_status === 'COMPLETED'
                      ? ''
                      : 'text-[#999999]'}
                    `}
                  >
                    {isCompleted ? '작성 완료' : '작성중'}
                  </span>
                </td>
                <td className='table-ceil text-center text-[#202020]'>
                  {new Date(row.updated_at).toLocaleDateString()}
                </td>
                <td className='table-ceil text-center'>
                  {isCompleted 
                  ?  <LuDownload
                        className='mx-auto'
                        size={30}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePdfDownload(row.contract_id);
                        }}
                      />
                  : <LuDownload
                        size={30}
                        color="white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePdfDownload(row.contract_id);
                        }}
                      />}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* 페이지네이션 */}
      <div className='pagenation-wrapper'>
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
