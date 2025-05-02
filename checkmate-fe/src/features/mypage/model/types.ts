// 내 전체 계약서 타입
export interface Contract {
    contract_id: number;
    category_id: number;
    title: string;
    source_type: string;
    page_no: number;
    created_at: string;
};
export interface ContractListData {
    contracts: Contract[];
};

//법원 조회 
export interface CourtList {
    courthouseId: number;
    courthouseName: string;
    courthouseAddress: string;
    courthousePhoneNumber: string;
};


