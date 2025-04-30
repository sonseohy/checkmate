import { motion } from 'framer-motion';
import ContentCertificationIcon from '@/assets/images/home/content-certification.png';
import ContractIcon from '@/assets/images/home/contract.png';
import PaymentOrderIcon from '@/assets/images/home/payment-order.png';
import { TemplateCardList } from '@/widgets/common/TemplateCardList'; // ✅ 공통 컴포넌트 import

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
  return (
    <section
      id="templates"
      className="relative min-h-[100vh] w-full overflow-hidden snap-start animated-gradient"
    >
      <div className="flex flex-col items-center max-w-screen-xl px-4 py-16 mx-auto">
        {/* 제목 */}
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
        <TemplateCardList templates={templates} />
      </div>
    </section>
  );
};

export default Section3;
