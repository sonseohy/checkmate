//사용자 계약서 
import { 
    Dropdown, 
    ContractTable, 
    ContractListData } from "@/features/mypage";
import { useState, useMemo } from "react";

export default function MyContracts() {

    const data:ContractListData = {
        contracts: [
            {
                "contract_id": 1,
                "category_id": 2,
                "title": "부동산 매매계약서",
                "source_type": "USER_UPLOAD",
                "updated_at": "2025-04-15T14:22:10.123456"
            },
            {
                "contract_id": 2,
                "category_id": 3,
                "title": "임대차 계약서",
                "source_type": "SERVICE_GENERATED",
                "updated_at": "2025-04-10T09:15:30.123456"
            }
        ]
    }

    const options = [
        { value: 'all', label: '전체'},
        { value: 'created', label: '작성한 계약서'},
        { value: 'analyzed', label: '분석한 계약서'},
    ]

    const [filter, setFilter ] = useState(options[0]);

    const filteredContracts = useMemo(() => {
        switch (filter.value) {
            case "created":
                return data.contracts.filter( c => c.source_type === 'USER_UPLOAD');
            case "analyzed":
                return data.contracts.filter( c => c.source_type === 'SERVICE_GENERATED');
            default:
                return data.contracts;
        }
    }, [filter, data.contracts]);

    return (
        <div className="flex flex-col gap-3 ">
            <div className="text-3xl font-bold">
                내 계약서 
            </div>
            <div className="mt-5 w-45 z-3">
                <Dropdown 
                    options={options} 
                    value = {filter}
                    onChange={setFilter} />           
            </div>
            <div className="max-w-230">
                {data.contracts.length >0 ? (
                    <ContractTable rowData={filteredContracts} />
                ) : ( <p> 등록된 계약서가 없습니다.</p>)}
                
            </div>
        </div>
    );
};
