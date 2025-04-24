import { motion } from 'framer-motion'
import AutoWriteIcon from '@/assets/home/auto-write.png'
import ESignIcon from '@/assets/home/e-sign.png'
import DocManageIcon from '@/assets/home/doc-manage.png'

const features = [
  {
    title: '자동 작성',
    desc: '필요한 정보만 입력하면 AI가 계약서를 자동으로 완성해 줍니다.',
    icon: AutoWriteIcon,
  },
  {
    title: '전자 서명',
    desc: '안전한 전자 서명으로 언제 어디서나 계약을 체결할 수 있습니다.',
    icon: ESignIcon,
  },
  {
    title: '문서 관리',
    desc: '모든 계약서를 한 곳에 모아두고, 키워드로 빠르게 검색하세요.',
    icon: DocManageIcon,
  },
]

const Section2 = () => (
  <section
    id="features"
    className="h-screen snap-start flex flex-col justify-center bg-gray-50 px-4"
  >
    <motion.h2
      initial={{ opacity: 0, y: -30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="text-3xl font-bold text-center mb-12"
    >
      어려운 계약서도 걱정 마세요
    </motion.h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map(({ title, desc, icon }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: i * 0.2 }}
          className="text-center px-6"
        >
          <img src={icon} alt={title} className="mx-auto mb-4 h-24" />
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600">{desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
)

export default Section2