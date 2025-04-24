import { motion } from 'framer-motion'
import RealEstateIcon from '@/assets/home/real-estate.png'
import RentalIcon from '@/assets/home/rental.png'
import EmploymentIcon from '@/assets/home/employment.png'

const templates = [
  {
    title: '부동산 매매 계약서',
    icon: RealEstateIcon,
  },
  {
    title: '임대차 계약서',
    icon: RentalIcon,
  },
  {
    title: '근로 계약서',
    icon: EmploymentIcon,
  },
]

const Section3 = () => (
  <section
    id="templates"
    className="h-screen snap-start flex flex-col justify-center bg-white px-4"
  >
    <motion.h2
      initial={{ opacity: 0, y: -30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="text-3xl font-bold text-center mb-12"
    >
      CHECKMATE가 함께 써드릴게요
    </motion.h2>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
      {templates.map(({ title, icon }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: i * 0.2 }}
          className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center shadow-lg"
        >
          <img src={icon} alt={title} className="h-32 mb-4" />
          <h3 className="text-xl font-semibold">{title}</h3>
        </motion.div>
      ))}
    </div>
  </section>
)

export default Section3
