import { useQuery } from '@tanstack/react-query';
import { fetchNews, NewsItem } from '@/features/news';

export const useNews = (query = '계약서') =>
  useQuery<NewsItem[], Error>({
    queryKey: ['news', query],
    queryFn: () => fetchNews(query),
    select: (items) => items.slice(0, 20), // 20개 제한
    staleTime: 1000 * 60 * 10, // 10분
  });
