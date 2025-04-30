// 중분류 + 소분류 + 실제 categoryId 추가 mock 데이터
export const mockCategories = [
  {
    id: 'contract',
    name: '계약서',
    midcategories: [
      {
        id: 'employment',
        name: '근로계약',
        subcategories: [
          { id: 'fulltime', name: '정규직 근로계약서', categoryId: 101 },
          { id: 'parttime', name: '파트타임 근로계약서', categoryId: 102 },
        ],
      },
      {
        id: 'real-estate',
        name: '부동산 계약',
        subcategories: [
          { id: 'sale', name: '부동산 매매 계약서', categoryId: 103 },
          { id: 'rental', name: '부동산 임대차 계약서', categoryId: 104 },
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
        name: '지급 지연',
        subcategories: [
          {
            id: 'payment-reminder',
            name: '지급 독촉 내용증명',
            categoryId: 201,
          },
        ],
      },
      {
        id: 'contract-breach',
        name: '계약 위반',
        subcategories: [
          { id: 'breach-warning', name: '계약 위반 경고장', categoryId: 202 },
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
        name: '대여금 지급',
        subcategories: [
          { id: 'loan-demand', name: '대여금 지급명령', categoryId: 301 },
        ],
      },
      {
        id: 'goods-payment',
        name: '물품대금 지급',
        subcategories: [
          { id: 'goods-demand', name: '물품대금 지급명령', categoryId: 302 },
        ],
      },
    ],
  },
];
