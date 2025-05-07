import { motion } from 'framer-motion';

interface FeatureItem {
  title: string;
  desc: React.ReactNode;
  icon: string;
}

interface FeatureGridSectionProps {
  sectionId?: string;
  heading: string;
  items: FeatureItem[];
  className?: string;
}

const FeatureGridSection = ({
  sectionId,
  heading,
  items,
  className = '',
}: FeatureGridSectionProps) => (
  <section
    id={sectionId}
    className={`flex flex-col justify-center w-full min-h-screen py-16 md:py-24 bg-gray-50 snap-start ${className}`}
  >
    <motion.h2
      initial={{ opacity: 0, y: -30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="text-2xl font-bold text-center md:text-4xl lg:text-5xl"
    >
      {heading}
    </motion.h2>

    <div className="grid grid-cols-1 gap-8 mt-16 md:grid-cols-3">
      {items.map(({ title, desc, icon }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: i * 0.2 }}
          className="px-4 text-center"
        >
          <img src={icon} alt={title} className="mx-auto mb-2 w-28 h-28" />
          <h3 className="mb-1 text-lg font-semibold md:text-xl lg:text-2xl">
            {title}
          </h3>
          <p className="text-sm text-gray-600 whitespace-pre-line md:text-base">
            {desc}
          </p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default FeatureGridSection;
