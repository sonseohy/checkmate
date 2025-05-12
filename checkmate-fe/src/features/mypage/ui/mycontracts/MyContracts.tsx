// 사용자 계약서 컴포넌트
import { 
    Dropdown, 
    ContractTable, 
    ContractListData, 
    contractList,
    Contract
} from "@/features/mypage";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";

export default function MyContracts() {
  // 데이터 요청
  const { data, isLoading, isError, error } = useQuery<ContractListData, Error>({
    queryKey: ['contractList'],
    queryFn: contractList,
  });

  // 필터 옵션
  const options = [
    { value: 'all',      label: '전체' },
    { value: 'created',  label: '작성한 계약서' },
    { value: 'analyzed', label: '분석한 계약서' },
  ];

  // 필터 상태
  const [filter, setFilter] = useState(options[0]);

  // data가 아직 없으면 빈 배열로 초기화
   const contracts = useMemo<Contract[]>(
    () => data?.contracts ?? [],
    [data?.contracts],
  );

  // 필터링된 계약서 리스트 (항상 Contract[] 반환)
  const filteredContracts = useMemo<Contract[]>(() => {
    switch (filter.value) {
      case 'created':
        return contracts.filter(c => c.source_type === 'USER_UPLOAD');
      case 'analyzed':
        return contracts.filter(c => c.source_type === 'SERVICE_GENERATED');
      default:
        return contracts;
    }
  }, [filter, contracts]);

  // 로딩 및 에러 핸들링
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error instanceof Error ? error.message : 'An error occurred'}</div>;
  }


  return (
    <div className="flex flex-col gap-3 m-10 p-10 rounded-2xl bg-white shadow-[0_0px_10px_rgba(0,0,0,0.2)]">
        <div className="text-3xl font-bold">내 계약서</div>
        <div className="">
            <div className="mt-5 w-45  relative z-3">
                <Dropdown
                options={options}
                value={filter}
                onChange={setFilter}
                />
            </div>

            <div className="mt-3">
                {contracts.length > 0 ? (
                <ContractTable rowData={filteredContracts} />
                ) : (
                <p>등록된 계약서가 없습니다.</p>
                )}
            </div>
        </div>
    </div>
  );
}
