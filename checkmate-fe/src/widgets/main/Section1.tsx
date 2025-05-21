import { motion } from 'framer-motion';
import HeroIllustration from '@/assets/images/home/hero-illustration.png';

const Section1 = () => (
  <section
    id="hero"
    className="flex flex-col items-center justify-center w-full h-screen text-center bg-white snap-start"
  >
    {/* Content group with even vertical spacing */}
    <motion.div className="flex flex-col items-center space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-extrabold leading-snug md:text-6xl lg:text-7xl"
      >
        계약 전엔,
        <br />
        체크메이트
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-lg text-gray-600"
      >
        클릭 몇 번으로 자동 작성·분석·관리까지
      </motion.p>

      <motion.img
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        src={HeroIllustration}
        alt="체크메이트 서비스 소개"
        className="w-56 h-auto"
      />
    </motion.div>
  </section>
);

export default Section1;
