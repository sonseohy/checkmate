import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface NewsItem {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate: string;
}

const Section6 = () => {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/news?q=계약서')
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch((err) => {
        console.error(err);
        setError('뉴스를 불러오는 중 오류가 발생했습니다.');
      });
  }, []);

  return (
    <section
      id="related-news"
      className="flex flex-col items-center justify-center w-full h-screen text-center bg-white snap-start"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-3xl font-bold text-center"
      >
        관련 뉴스
      </motion.h2>

      {error && <p className="text-red-500">{error}</p>}

      <div className="relative w-full max-w-5xl overflow-hidden">
        <div className="flex px-4 space-x-6 overflow-x-auto snap-x snap-mandatory">
          {articles.map((item, i) => (
            <motion.a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="flex-shrink-0 w-64 p-4 transition-shadow bg-white rounded-lg shadow snap-start hover:shadow-md"
            >
              <h3
                className="mb-2 font-semibold text-gray-800 line-clamp-2"
                dangerouslySetInnerHTML={{ __html: item.title }}
              />
              <p
                className="text-sm text-gray-600 line-clamp-4"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
              <p className="mt-4 text-xs text-gray-400">
                {new Date(item.pubDate).toLocaleDateString('ko-KR')}
              </p>
            </motion.a>
          ))}
        </div>

        {/* 좌/우 화살표 (추가 구현 가능) */}
      </div>
    </section>
  );
};
export default Section6;
