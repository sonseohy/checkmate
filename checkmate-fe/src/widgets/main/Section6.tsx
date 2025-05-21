import { NewsCarousel } from '@/features/news';

const Section6: React.FC = () => (
  <section
    id="related-news"
    className="flex flex-col items-center justify-start w-full h-auto min-h-screen px-4 py-4 text-center bg-white snap-start sm:justify-center sm:h-screen sm:py-0"
  >
    <h2 className="mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl">관련 뉴스</h2>
    <NewsCarousel />
  </section>
);

export default Section6;
