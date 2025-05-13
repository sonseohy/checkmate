import { Contract } from '@/features/mypage/model/types';
import { useState } from 'react';
import './ContractTable.css';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { LuDownload } from "react-icons/lu";
import { getContractownload } from '@/features/detail';

interface ContractTableProps {
  rowData: Contract[];
}

const ROW_PER_PAGE = 10;

const ContractTable: React.FC<ContractTableProps> = ({ rowData }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [seletedIds, setSeletedIds] = useState<Set<number>>(new Set());
  //페이지네이션 로직
  const pageCount = Math.ceil(rowData.length / ROW_PER_PAGE);
  const offset = currentPage * ROW_PER_PAGE;
  const currentRows = rowData.slice(offset, offset  + ROW_PER_PAGE);

  const handlePageClick = ({ selected }: { selected: number }) => {
  setCurrentPage(selected);
};

  //전체 선택/취소
  const toggleSeletAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSeletedIds(new Set(rowData.map((r) => r.contract_id)));
    } else {
      setSeletedIds(new Set());
    }
  };

  //개별 선택
  const toggleSelect = (id: number) => {
    const next = new Set(seletedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSeletedIds(next);
};
  // 다운로드
  const handlePdfDownload = (id:number) => {
    console.log('다운로드 클릭')
    getContractownload(id);
  };

  return (
    <div className=' p-0 overflow-x-hidden'>
      <table className='w-full mb-0 border-t border-b border-[#e2e8f0] text-[#4a5568] table-fixed'>
        <thead>
          <tr className='align-bottom'>
            <th className='table-head-ceil  w-8 text-center'>
              <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={seletedIds.size === rowData.length}
                  onChange={toggleSeletAll}
                />
            </th>
            <th className='table-head-ceil w-8 text-center'> 분류 </th>
            <th className='table-head-ceil w-20 text-center'> 계약서 명 </th>
            <th className='table-head-ceil w-12 text-center'> 최종 수정일 </th>
            <th className='table-head-ceil w-12 text-center'> 다운로드 </th>
          </tr>
        </thead>
        <tbody className='table-body w-8 text-center'>
          {currentRows.map((row) => {
            const isWritten = row.source_type === 'USER_UPLOAD';
            return (
              <tr 
                className="hover:cursor-pointer" 
                key={row.contract_id}
                onClick={() =>
                  navigate(`/detail/${row.contract_id}`, {
                    state: { contract: row },
                  })
                }
              >
                <td className='table-ceil text-center'>
                   <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={seletedIds.has(row.contract_id)}
                    onChange={() => toggleSelect(row.contract_id)}
                  />
                </td>
                 <td className="table-ceil text-center">
                    <span
                      className={`inline-block px-3 py-1 text-sm font-bold uppercase rounded
                        ${row.source_type === 'USER_UPLOAD'
                          ? 'bg-[#FFB4B5] text-[#991B33]'
                          : 'bg-[#B4C7FF] text-[#3053B4]'}
                      `}
                    >
                      {isWritten ? '작성' : '분석'}
                    </span>
                  </td>
                <td className='table-ceil text-center'>{row.title}</td>
                <td className='table-ceil text-center'>{new Date(row.updated_at).toLocaleDateString()}</td>
                <td className='table-ceil flex justify-center text-center'> 
                  <LuDownload 
                    size={30} 
                    onClick={e => {
                      e.stopPropagation();               // tr onClick 과 겹치지 않도록
                      handlePdfDownload(row.contract_id);
                    }}/> 
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
  )
};
export default ContractTable;
