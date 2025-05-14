
// 내 전체 계약서 타입
export interface Contract {
    contract_id: number;
    category_id: number;
    title: string;
    source_type: string;
    edit_status: string;
    updated_at: string;
};
export interface ContractListData {
    contracts: Contract[];
};

// 법원 조회 (기본 정보)
export interface Courthouse {
  courthouseId: number;
  courthouseName: string;
  courthouseAddress: string;
  courthousePhoneNumber: string;
  longitude: number;
  latitude: number;
};

// 법원 리스트 (위도와 경도가 포함된)
export interface CourthouseList {
    Courthouses: Courthouse[]; 
};
