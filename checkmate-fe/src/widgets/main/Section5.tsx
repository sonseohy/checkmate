import { motion } from 'framer-motion'
import RealEstateIcon from '@/assets/home/real-estate.png'
import RentalIcon from '@/assets/home/rental.png'
import EmploymentIcon from '@/assets/home/employment.png'

const templates = [
  { title: '부동산 매매 계약서', icon: RealEstateIcon },
  { title: '임대차 계약서', icon: RentalIcon },
  { title: '근로 계약서', icon: EmploymentIcon },
]

// 카드 애니메이션 variants
const cardVariants = {
  initial: { opacity: 0, scale: 0.5, x: 0, rotate: 0 },
  animate: (i: number) => ({
    opacity: 1,
    scale: 1,
    x: i === 0 ? -240 : i === 1 ? 0 : 240,
    rotate: i === 0 ? -6 : i === 1 ? 0 : 6,
    transition: { duration: 0.8, delay: i * 0.3 },
  }),
}

const Section5 = () => (
<section id="templates" className="flex flex-col items-center justify-start min-h-screen px-4 pt-16 -mx-4 bg-white snap-start">
    <motion.h2
      initial={{ opacity: 0, y: -30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mb-12 text-6xl font-bold leading-tight text-center"
    >
      <span className="text-transparent bg-gradient-to-r from-blue-700 to-blue-300 bg-clip-text">
        CHECKMATE
      </span>
      가<br /> 함께 써드릴게요
    </motion.h2>

<div className="relative flex items-center justify-center w-full max-w-4xl mt-8 h-80">      {templates.map(({ title, icon }, i) => (
        <motion.div
          key={title}
          custom={i}
          variants={cardVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.5 }}
          className="absolute flex flex-col items-center justify-center p-8 bg-white shadow-lg cursor-pointer w-72 rounded-2xl"
          style={{ zIndex: i === 1 ? 20 : 10 }}
          whileHover={{ scale: 1.05, rotate: 0, boxShadow: '0px 10px 20px rgba(0,0,0,0.15)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <img src={icon} alt={title} className="mb-4 h-36" />
          <h3 className="text-xl font-semibold text-center">{title}</h3>
        </motion.div>
      ))}
    </div>
  </section>
)

export default Section5
