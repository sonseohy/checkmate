// 사용자 계약서 컴포넌트
import { deleteContractDetail } from '@/features/detail';
import {
  Dropdown,
  ContractTable,
  ContractListData,
  contractList,
  Contract,
} from '@/features/mypage';
import { useMobile } from '@/shared';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import Swal from 'sweetalert2';

export default function MyContracts() {
  const isMobile = useMobile();
  //체크박스 상태
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // 데이터 요청
  const { data, isLoading, isError, error, refetch } = useQuery<
    ContractListData,
    Error
  >({
    queryKey: ['contractList'],
    queryFn: contractList,
  });

  // 필터 옵션
  const options = [
    { value: 'all', label: '전체' },
    { value: 'created', label: '작성한 계약서' },
    { value: 'analyzed', label: '분석한 계약서' },
  ];

  // 필터 상태
  const [filter, setFilter] = useState(options[0]);

  // data가 아직 없으면 빈 배열로 초기화
  const contracts = useMemo<Contract[]>(
    () => data?.contracts ?? [],
    [data?.contracts],
  );

  // 필터링된 계약서 리스트
  const filteredContracts = useMemo<Contract[]>(() => {
    switch (filter.value) {
      case 'created':
        return contracts.filter((c) => c.source_type === 'SERVICE_GENERATED');
      case 'analyzed':
        return contracts.filter((c) => c.source_type === 'USER_UPLOAD');
      default:
        return contracts;
    }
  }, [filter, contracts]);

  // 삭제 함수
  const handleDeleteContracts = async () => {
    if (selectedIds.size === 0) {
      return;
    }

    try {
      const confirmDelete = await Swal.fire({
        title: '정말 삭제하시겠습니까?',
        text: '선택한 계약서를 삭제합니다. 삭제 후에는 복구할 수 없습니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소',
      });

      if (confirmDelete.isConfirmed) {
        for (const contractId of Array.from(selectedIds)) {
          await deleteContractDetail(contractId);
        }

        await refetch();
        Swal.fire('삭제 완료', '선택한 계약서가 삭제되었습니다.', 'success');
      }
    } catch {
      Swal.fire('삭제 실패', '계약서 삭제 중 문제가 발생했습니다.', 'error');
    }
  };

  // 선택된 계약서 ID 추적
  const toggleSelect = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // 전체 선택/취소
  const toggleSeletAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(contracts.map((r) => r.contract_id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  // 로딩 및 에러 핸들링
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'An error occurred'}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col rounded-2xl bg-white shadow-[0_0px_10px_rgba(0,0,0,0.1)] ${
        isMobile ? '' : 'm-10 p-10 gap-3 '
      }`}
    >
      {isMobile ? '' : <div className="text-3xl font-bold">내 계약서</div>}
      <div className={` ${isMobile ? 'p-2' : ''}`}>
        <div className="flex flex-row justify-between items-center">
          {/* 드롭다운 */}
          <div
            className={` relative z-3 ${isMobile ? 'w-28 my-1' : ' w-45 my-5'}`}
          >
            <Dropdown options={options} value={filter} onChange={setFilter} />
          </div>
          <button
            className={` border-1 ${
              isMobile
                ? ' px-3 py-1 rounded-lg text-sm '
                : ' px-4 py-2  rounded-xl text-2xl'
            } ${
              selectedIds.size === 0
                ? 'text-[#cccccc] border-[#cccccc]'
                : 'text-[#9E9E9E] border-[#9E9E9E]'
            }`}
            onClick={handleDeleteContracts}
            disabled={selectedIds.size === 0}
          >
            삭제
          </button>
        </div>

        <div className="mt-3">
          {contracts.length > 0 ? (
            <ContractTable
              rowData={filteredContracts}
              selectedIds={selectedIds}
              toggleSelect={toggleSelect}
              toggleSelectAll={toggleSeletAll}
            />
          ) : (
            <p>등록된 계약서가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
