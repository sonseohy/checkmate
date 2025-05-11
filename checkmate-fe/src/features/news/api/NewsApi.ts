import { NewsItem, NewsResponse } from '@/features/news';
import { customAxios } from '@/shared/api';

export async function fetchNews(query = '계약서'): Promise<NewsItem[]> {
  const { data } = await customAxios.get<NewsResponse>('/api/news', {
    params: { q: query },
  });

  return data.data.items;
}
