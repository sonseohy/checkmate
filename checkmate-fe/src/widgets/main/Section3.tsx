import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ContentCertificationIcon from '@/assets/images/home/content-certification.png';
import ContractIcon from '@/assets/images/home/contract.png';
import PaymentOrderIcon from '@/assets/images/home/payment-order.png';
import { useCardVariants } from '@/shared/animations/useCardVariants';
import { desktopCardVariants } from '@/shared/animations/cardVariants';

const templates = [
  {
    title: '내용증명',
    icon: ContentCertificationIcon,
    link: '/content-certification',
  },
  { title: '계약서', icon: ContractIcon, link: '/contract' },
  { title: '지급명령', icon: PaymentOrderIcon, link: '/payment-order' },
];

const Section3 = () => {
  const variants = useCardVariants();

  return (
    <section
      id="templates"
      className="relative min-h-[100vh] w-full overflow-hidden snap-start bg-gradient-move animate-gradient-move"
    >
      <div className="flex flex-col items-center w-full py-16">
        {/* 제목 애니메이션 */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold leading-tight text-center md:text-6xl"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-300">
            CHECKMATE
          </span>
          가<br /> 함께 써드릴게요
        </motion.h2>

        {/* 카드 목록 */}
        <div className="flex flex-wrap justify-center gap-8 mt-8 md:relative md:flex-nowrap md:items-end md:h-80">
          {templates.map(({ title, icon, link }, i) => (
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
      </div>
    </section>
  );
};

export default Section3;
