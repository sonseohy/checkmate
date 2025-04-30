import { motion } from 'framer-motion';
import { useCardVariants } from '@/shared/constants/animations/useCardVariants';
import { desktopCardVariants } from '@/shared/constants/animations/cardVariants';

interface TemplateCardListProps {
  templates: { title: string; icon: string; link: string }[];
}

export const TemplateCardList: React.FC<TemplateCardListProps> = ({
  templates,
}) => {
  const variants = useCardVariants();

  return (
    <div className="flex flex-wrap justify-center gap-8 mt-8 md:relative md:flex-nowrap md:items-end md:h-80">
      {templates.map(({ title, icon }, i) => (
        <motion.div
          key={title}
          custom={i}
          variants={variants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.5 }}
          className="flex flex-col items-center justify-center w-full p-6 shadow-lg cursor-pointer h-80 bg-blue-50 rounded-2xl sm:w-72 sm:p-8 md:absolute"
          style={{ zIndex: i === 1 ? 20 : 10 }}
          whileHover={
            variants === desktopCardVariants
              ? {
                  scale: 1.05,
                  rotate: 0,
                  boxShadow: '0px 10px 20px rgba(0,0,0,0.15)',
                }
              : {}
          }
        >
          <h1 className="mb-4 text-4xl font-bold text-center">{title}</h1>
          <img src={icon} alt={title} className="h-40" />
        </motion.div>
      ))}
    </div>
  );
};
