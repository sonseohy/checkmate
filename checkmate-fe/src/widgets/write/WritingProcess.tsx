import { motion } from 'framer-motion';
import UploadIcon from '@/assets/images/home/contract-upload.png';
import AnalysisIcon from '@/assets/images/home/ai-analysis.png';
import SummaryIcon from '@/assets/images/home/summary-feedback.png';

const steps = [
  {
    title: '작성 전 주의사항 제공',
    desc: '체크리스트를 통해 놓치기 쉬운 항목을 미리 확인하세요.',
    icon: UploadIcon,
  },
  {
    title: '간편 작성 기능',
    desc: '질문에 답하기만 하면 주요 조항을 자동으로 채워드립니다.',
    icon: AnalysisIcon,
  },
  {
    title: '최종 계약서 제공',
    desc: '완성된 계약서를 PDF로 다운로드 하실 수 있습니다.',
    icon: SummaryIcon,
  },
];

const WritingProcess: React.FC = () => (
  <section
    id="common-features"
    className="flex flex-col items-center py-16 bg-gray-50"
  >
    <motion.h2
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-12 text-3xl font-bold text-center"
    >
      계약서 작성 절차
    </motion.h2>

    <div className="grid grid-cols-1 gap-8 px-4 md:grid-cols-3">
      {steps.map(({ title, desc, icon }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.2 }}
          className="flex flex-col items-center p-6 text-center bg-white shadow-md rounded-xl"
        >
          <img src={icon} alt={title} className="w-24 h-24 mb-4" />
          <h3 className="mb-2 text-xl font-semibold">{title}</h3>
          <p className="text-gray-600">{desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default WritingProcess;
