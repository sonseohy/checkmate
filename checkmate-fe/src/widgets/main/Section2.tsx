import { motion } from 'framer-motion';
import AutoWriteIcon from '@/assets/images/home/auto-write.png';
import ESignIcon from '@/assets/images/home/e-sign.png';
import DocManageIcon from '@/assets/images/home/doc-manage.png';

const features = [
  {
    title: '자동 작성',
    desc: (
      <>
        필요한 정보만 입력하면
        <br />
        계약서를 자동으로 완성해 줍니다.
      </>
    ),
    icon: AutoWriteIcon,
  },
  {
    title: '전자 서명',
    desc: (
      <>
        안전한 전자 서명으로 언제든지
        <br />
        어디서나 계약을 체결할 수 있습니다.
      </>
    ),
    icon: ESignIcon,
  },
  {
    title: '문서 관리',
    desc: (
      <>
        모든 계약서를 한 곳에 모아두고
        <br />
        키워드로 빠르게 검색하세요.
      </>
    ),
    icon: DocManageIcon,
  },
];

const Section2 = () => (
  <section
    id="features"
    className="flex flex-col justify-center w-full min-h-screen gap-y-40 bg-gray-50 snap-start"
  >
    <motion.h2
      initial={{ opacity: 0, y: -30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="text-2xl font-bold text-center md:text-4xl lg:text-5xl"
    >
      어려운 계약서도 걱정 마세요
    </motion.h2>

    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {features.map(({ title, desc, icon }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: i * 0.2 }}
          className="px-6 text-center"
        >
          <img src={icon} alt={title} className="w-32 h-32 mx-auto mb-4" />
          <h3 className="mb-1 text-lg font-semibold md:text-xl lg:text-2xl">
            {title}
          </h3>
          <p className="text-gray-600 whitespace-pre-line">{desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Section2;
