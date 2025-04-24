import { motion } from 'framer-motion'
import HeroIllustration from '@/assets/home/hero-illustration.png'

const Section1 = () => (
  <section
    id="hero"
    className="h-screen snap-start flex flex-col justify-center bg-white text-center px-4"
  >
    <motion.h1
      initial={{ opacity: 0, y: -50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="text-5xl font-extrabold mb-4"
    >
      계약 전엔, 체크메이트
    </motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="text-lg text-gray-600 mb-8"
    >
      복잡한 계약서, 클릭 몇 번으로 자동 작성·분석·관리까지
    </motion.p>

    <motion.img
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.4 }}
      src={HeroIllustration}
      alt="체크메이트 서비스 소개"
      className="mx-auto w-48 h-auto"
    />
  </section>
)

export default Section1
