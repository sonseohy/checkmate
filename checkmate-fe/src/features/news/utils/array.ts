// 배열을 4개씩 나누는 함수
import { NewsItem } from '@/features/news';

export const chunk4 = (items: NewsItem[]): NewsItem[][] => {
  const out: NewsItem[][] = [];
  for (let i = 0; i < items.length; i += 4) {
    out.push(items.slice(i, i + 4));
  }
  return out;
};
