import { useQuery } from '@tanstack/react-query';
import { fetchNews, NewsItem } from '@/features/news';

// statletime은 데이터를 신선하다고 간주하고 이 시간동안 캐싱한다는 얘기
// 여기서는 10분으로 설정
export const useNews = (query = '계약서') =>
  useQuery<NewsItem[], Error>({
    queryKey: ['news', query],
    queryFn: () => fetchNews(query),
    select: (items) => items.slice(0, 20), // 20개 제한
    staleTime: 1000 * 60 * 10, // 10분
  });
