export const categorySlugMap = {
  contract: 1,
  certification: 2,
  order: 3,
  etc: 4,
} as const;

export const categoryIdToSlugMap = Object.fromEntries(
  Object.entries(categorySlugMap).map(([k, v]) => [v, k]),
);

// 한글 → slug 매핑
export const categoryNameToSlugMap: Record<
  string,
  keyof typeof categorySlugMap
> = {
  계약서: 'contract',
  내용증명: 'certification',
  지급명령: 'order',
  기타: 'etc',
};

export const categoryIdToNameMap: Record<number, string> = {
  1: '계약서',
  2: '내용증명',
  3: '지급명령',
  4: '기타',
};
