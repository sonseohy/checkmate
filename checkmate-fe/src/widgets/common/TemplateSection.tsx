import { motion } from 'framer-motion';
import { TemplateCardList } from '@/widgets/common/TemplateCardList';
import { useNavigate } from 'react-router-dom';
import { categoryNameToSlugMap } from '@/shared/constants/categorySlugMap';

interface TemplateItem {
  title: string;
  icon: string;
  link?: string;
}

interface TemplateSectionProps {
  sectionId?: string;
  heading: string;
  templates: TemplateItem[];
}

export const TemplateSection = ({
  sectionId,
  heading,
  templates,
}: TemplateSectionProps) => {
  const navigate = useNavigate();

  const handleCardClick = (title: string) => {
    const slug = categoryNameToSlugMap[title];
    if (slug) {
      navigate(`/write/${slug}`);
    }
  };

  return (
    <section
      id={sectionId}
      className="relative min-h-[100vh] w-full overflow-hidden snap-start animated-gradient"
    >
      <div className="flex flex-col items-center max-w-screen-xl px-4 py-12 mx-auto md:py-16">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-10 text-4xl font-bold leading-tight text-center md:text-6xl"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-300">
            CHECKMATE
          </span>
          가<br /> {heading}
        </motion.h2>
        {/* 카드를 표시할 공간을 충분히 확보 */}
        <div className="w-full pt-4">
          <TemplateCardList
            templates={templates}
            onClickCard={handleCardClick}
          />
        </div>
      </div>
    </section>
  );
};
