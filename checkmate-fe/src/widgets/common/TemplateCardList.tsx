import { motion } from 'framer-motion';
import { useCardVariants } from '@/shared/constants/animations/useCardVariants';
import { desktopCardVariants } from '@/shared/constants/animations/cardVariants';

interface TemplateItem {
  title: string;
  icon: string;
}

interface TemplateCardListProps {
  templates: TemplateItem[];
  onClickCard?: (title: string) => void;
}

export const TemplateCardList: React.FC<TemplateCardListProps> = ({
  templates,
  onClickCard,
}) => {
  const variants = useCardVariants();

  return (
    // ① base = grid-cols-2 ② md↑ = flex 절대배치
    <div className="grid grid-cols-2 gap-4 mt-8 md:relative md:flex md:flex-nowrap md:items-end md:h-80 md:gap-8 md:w-full md:justify-center">
      {templates.map(({ title, icon }, i) => (
        <motion.div
          key={title}
          custom={i}
          variants={variants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.5 }}
          /* 모바일: w-full → grid 셀 전체 차지 / md↑: w-72 + absolute */
          className="flex flex-col items-center justify-center w-full p-4 shadow-lg cursor-pointer h-60 bg-blue-50 rounded-2xl sm:p-6 sm:h-72 md:w-72 md:h-80 md:p-8 md:absolute"
          style={{ zIndex: i === 1 ? 20 : 10 }}
          whileHover={
            variants === desktopCardVariants
              ? {
                  scale: 1.05,
                  rotate: 0,
                  boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                }
              : {}
          }
          onClick={() => onClickCard?.(title)}
        >
          <h1 className="mb-4 text-2xl font-bold text-center sm:text-3xl md:text-4xl">
            {title}
          </h1>
          <img src={icon} alt={title} className="h-32 sm:h-40" />
        </motion.div>
      ))}
    </div>
  );
};
