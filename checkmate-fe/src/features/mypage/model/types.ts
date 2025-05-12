// 내 전체 계약서 타입
export interface Contract {
    contract_id: number;
    category_id: number;
    title: string;
    source_type: string;
    updated_at: string;
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
// 법원 응답 + 위도+ 경도
export interface CourtWithCoords extends CourtList {
    lat: number;
    lng: number;
}

//위도, 경도
export interface LatLng {
    lat: number;
    lng: number;
}
