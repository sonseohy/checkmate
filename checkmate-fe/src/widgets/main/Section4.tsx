import { motion } from 'framer-motion';
import UploadIcon from '@/assets/images/home/contract-upload.png';
import AnalysisIcon from '@/assets/images/home/ai-analysis.png';
import SummaryIcon from '@/assets/images/home/summary-feedback.png';

const steps = [
  {
    title: '계약서 업로드',
    desc: '웹에서 파일을 올려보세요.',
    icon: UploadIcon,
  },
  {
    title: 'AI 기반 계약서 분석',
    desc: (
      <>
        AI가 핵심 조항을
        <br />
        자동으로 분석해 드립니다.
      </>
    ),
    icon: AnalysisIcon,
  },
  {
    title: '피드백 및 요약 제공',
    desc: (
      <>
        중요 내용을 <br /> 깔끔하게 요약해 드릴게요.
      </>
    ),
    icon: SummaryIcon,
  },
];

const Section4 = () => (
  <section
    id="process"
    className="flex flex-col justify-center w-full min-h-screen gap-y-40 bg-gray-50 snap-start"
  >
    <motion.h2
      initial={{ opacity: 0, y: -30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="text-2xl font-bold text-center md:text-4xl lg:text-5xl"
    >
      복잡한 계약서도 걱정 마세요
    </motion.h2>

    <div className="grid grid-cols-1 md:grid-cols-3">
      {steps.map(({ title, desc, icon }, i) => (
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
          <p className="text-sm text-gray-600 md:text-base">{desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Section4;
