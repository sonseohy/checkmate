export interface NewsItem {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate: string;
}

export interface NewsResponse {
  success: boolean;
  data: { items: NewsItem[] };
}
