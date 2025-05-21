import { motion } from 'framer-motion';

/* WebP + PNG 한꺼번에 import */
import UploadIconWebp from '@/assets/images/home/contract-upload.webp';
import UploadIconPng from '@/assets/images/home/contract-upload.png';
import AnalysisIconWebp from '@/assets/images/home/ai-analysis.webp';
import AnalysisIconPng from '@/assets/images/home/ai-analysis.png';
import SummaryIconWebp from '@/assets/images/home/summary-feedback.webp';
import SummaryIconPng from '@/assets/images/home/summary-feedback.png';

const steps = [
  {
    title: '작성 전 주의사항 제공',
    desc: (
      <>
        체크리스트를 통해
        <br />
        놓치기 쉬운 항목을 미리 확인하세요.
      </>
    ),
    webp: UploadIconWebp,
    png: UploadIconPng,
  },
  {
    title: '간편 작성 기능',
    desc: (
      <>
        질문에 답하기만 하면
        <br />
        주요 조항을 자동으로 채워드립니다.
      </>
    ),
    webp: AnalysisIconWebp,
    png: AnalysisIconPng,
  },
  {
    title: '최종 계약서 제공',
    desc: (
      <>
        완성된 계약서를
        <br />
        PDF로 다운로드 하실 수 있습니다.
      </>
    ),
    webp: SummaryIconWebp,
    png: SummaryIconPng,
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

    {/* 📱 1→2→3단 그리드로 자연스런 줄바꿈 */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
      {steps.map(({ title, desc, webp, png }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.2 }}
          className="flex flex-col items-center p-6 text-center bg-white shadow-md rounded-xl"
        >
          {/* ✅ 작은 화면 w-36, 태블릿 w-48, 데스크톱 w-[17.5rem] */}
          <picture className="mb-2 w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-[17.5rem] lg:h-[17.5rem]">
            <source srcSet={webp} type="image/webp" />
            <img
              src={png}
              alt={title}
              className="w-full h-full object-contain"
            />
          </picture>

          <h3 className="mb-2 text-xl font-semibold">{title}</h3>
          <p className="text-gray-600">{desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default WritingProcess;
