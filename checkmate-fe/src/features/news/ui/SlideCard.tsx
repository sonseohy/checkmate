import type { NewsItem } from '@/features/news';

interface SlideCardProps {
  article: NewsItem;
  onClick: () => void;
}

const SlideCard: React.FC<SlideCardProps> = ({ article, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col w-full h-40 p-3 my-2 text-left transition-shadow bg-white rounded-lg shadow hover:shadow-md sm:h-auto sm:p-4"
  >
    <h3
      className="mb-2 text-sm font-medium text-gray-800 line-clamp-2 sm:font-semibold sm:text-base"
      dangerouslySetInnerHTML={{ __html: article.title }}
    />
    <p
      className="flex-1 text-xs text-gray-600 line-clamp-3 sm:text-sm sm:line-clamp-4"
      dangerouslySetInnerHTML={{ __html: article.description }}
    />
    <p className="mt-2 text-[11px] text-gray-400 sm:mt-3 sm:text-xs">
      {new Date(article.pubDate).toLocaleDateString('ko-KR')}
    </p>
  </button>
);

export default SlideCard;
