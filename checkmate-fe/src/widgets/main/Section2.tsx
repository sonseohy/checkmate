import { motion } from 'framer-motion'
import AutoWriteIcon from '@/assets/home/auto-write.png'
import ESignIcon from '@/assets/home/e-sign.png'
import DocManageIcon from '@/assets/home/doc-manage.png'

const features = [
  {
    title: '자동 작성',
    desc: (
      <>
        필요한 정보만 입력하면<br />
        계약서를 자동으로 완성해 줍니다.
      </>
    ),
    icon: AutoWriteIcon,
  },
  {
    title: '전자 서명',
    desc: (
      <>
        안전한 전자 서명으로 언제든지<br />
        어디서나 계약을 체결할 수 있습니다.
      </>
    ),
    icon: ESignIcon,
  },
  {
    title: '문서 관리',
    desc: (
      <>
        모든 계약서를 한 곳에 모아두고<br />
        키워드로 빠르게 검색하세요.
      </>
    ),
    icon: DocManageIcon,
  },
]

const Section2 = () => (
  <section
    id="features"
    className="relative overflow-hidden bg-gray-50 snap-start"
  >
    <div className="flex flex-col items-center max-w-6xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-12 text-3xl font-bold text-center"
      >
        어려운 계약서도 걱정 마세요
      </motion.h2>

      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
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
            <h3 className="mb-2 text-xl font-semibold">{title}</h3>
            <p className="text-gray-600 whitespace-pre-line">{desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

export default Section2
