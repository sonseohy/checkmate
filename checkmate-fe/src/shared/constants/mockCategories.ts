// 대분류 > 중분류 > 소분류 Mock 데이터

export const mockCategories = [
  {
    id: 'contract', // 대분류 slug
    name: '계약서', // 대분류 이름
    midcategories: [
      {
        id: 'employment', // 중분류 slug
        name: '근로계약서', // 중분류 이름
        subcategories: [
          { id: 'fulltime', name: '주 40시간 근로계약서' }, // 소분류
          { id: 'overtime', name: '주 52시간 근로계약서' },
        ],
      },
      {
        id: 'real-estate',
        name: '부동산 매매 계약서',
        subcategories: [
          { id: 'apartment', name: '아파트 매매 계약서' },
          { id: 'office', name: '오피스텔 매매 계약서' },
        ],
      },
      {
        id: 'rental',
        name: '임대차 계약서',
        subcategories: [
          { id: 'house-rental', name: '주택 임대차 계약서' },
          { id: 'store-rental', name: '상가 임대차 계약서' },
        ],
      },
    ],
  },
  {
    id: 'content-certification',
    name: '내용증명',
    midcategories: [
      {
        id: 'payment-delay',
        name: '지급 지연 내용증명',
        subcategories: [
          { id: 'salary-delay', name: '급여 지급 지연 내용증명' },
          { id: 'loan-delay', name: '대여금 지급 지연 내용증명' },
        ],
      },
      {
        id: 'contract-breach',
        name: '계약 위반 내용증명',
        subcategories: [
          { id: 'rental-breach', name: '임대차 계약 위반' },
          { id: 'sales-breach', name: '매매 계약 위반' },
        ],
      },
    ],
  },
  {
    id: 'payment-order',
    name: '지급명령',
    midcategories: [
      {
        id: 'loan-payment',
        name: '대여금 지급명령',
        subcategories: [
          { id: 'personal-loan', name: '개인 대여금 지급명령' },
          { id: 'business-loan', name: '사업자 대여금 지급명령' },
        ],
      },
      {
        id: 'goods-payment',
        name: '물품대금 지급명령',
        subcategories: [
          { id: 'product-payment', name: '상품 구매 대금 지급명령' },
          { id: 'material-payment', name: '자재 대금 지급명령' },
        ],
      },
    ],
  },
];
