import { motion } from 'framer-motion'
import RealEstateIcon from '@/assets/home/real-estate.png'
import RentalIcon    from '@/assets/home/rental.png'
import EmploymentIcon from '@/assets/home/employment.png'
import useIsMd from '@/shared/hooks/useIsMd'
import { useCardVariants } from '@/shared/animations/useCardVariants'
import { desktopCardVariants } from '@/shared/animations/cardVariants'

const templates = [
  { title: '부동산 매매 계약서', icon: RealEstateIcon },
  { title: '임대차 계약서',    icon: RentalIcon },
  { title: '근로 계약서',      icon: EmploymentIcon },
]

const Section5 = () => {
  const variants = useCardVariants()  

  return (
    <section
      id="demos"
      className="relative min-h-screen overflow-hidden bg-white snap-start"
    >
      <div className="flex flex-col items-center max-w-6xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
                {/* 제목 애니메이션 */}
                <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold leading-tight text-center md:text-6xl"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-300">
            CHECKMATE
          </span>
          가<br /> 함께 봐드릴게요
        </motion.h2>

        <div
          className={`
            mt-8 flex flex-wrap justify-center gap-8
            md:relative md:flex-nowrap md:items-end md:h-80
          `}
        >
          {templates.map(({ title, icon }, i) => (
            <motion.div
              key={title}
              custom={i}
              variants={variants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.5 }}
              className={`
                flex flex-col items-center justify-center
                bg-white shadow-lg rounded-2xl cursor-pointer
                w-full sm:w-72 p-6 sm:p-8
                md:absolute
              `}
              style={{ zIndex: i === 1 ? 20 : 10 }}
              whileHover={variants === desktopCardVariants ? {
                scale: 1.05, rotate: 0,
                boxShadow: '0px 10px 20px rgba(0,0,0,0.15)'
              } : {}}
            >
              <img src={icon} alt={title} className="mb-4 h-36" />
              <h3 className="text-xl font-semibold text-center">{title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Section5