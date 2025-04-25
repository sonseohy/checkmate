// widgets/main/Section3.tsx
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import RealEstateIcon from '@/assets/home/real-estate.png'
import RentalIcon    from '@/assets/home/rental.png'
import EmploymentIcon from '@/assets/home/employment.png'

const templates = [
  { title: '부동산 매매 계약서', icon: RealEstateIcon },
  { title: '임대차 계약서',    icon: RentalIcon },
  { title: '근로 계약서',      icon: EmploymentIcon },
]

// Two variant‐sets: one for desktop (with x/rotate), one for mobile (just fade+scale)
const desktopVariants = {
  initial:  { opacity: 0, scale: 0.5, x: 0,    rotate: 0 },
  animate: (i: number) => ({
    opacity: 1,
    scale:   1,
    x:       i === 0 ? -240 : i === 1 ? 0 : 240,
    rotate:  i === 0 ? -6   : i === 1 ? 0 : 6,
    transition: { duration: 0.8, delay: i * 0.3 },
  }),
}

const mobileVariants = {
  initial:  { opacity: 0, scale: 0.5 },
  animate:  (i: number) => ({
    opacity: 1,
    scale:   1,
    transition: { duration: 0.8, delay: i * 0.2 },
  }),
}

// Hook to track md-breakpoint
function useIsMd() {
  const [isMd, setIsMd] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  )
  useEffect(() => {
    const onResize = () => setIsMd(window.innerWidth >= 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return isMd
}

const Section5 = () => {
  const isMd = useIsMd()
  const variants = isMd ? desktopVariants : mobileVariants

  return (
    <section
      id="templates"
      className="relative min-h-screen overflow-hidden bg-white snap-start"
    >
      <div className="flex flex-col items-center max-w-6xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity:0, y:-30 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          transition={{ duration:0.8 }}
          className="text-4xl font-bold leading-tight text-center md:text-6xl"
        >
          <span className="text-transparent bg-gradient-to-r from-blue-700 to-blue-300 bg-clip-text">
          체크메이트
          </span>
          가<br /> 함께 봐드릴게요
        </motion.h2>

        <div
          className={`
            mt-8 flex flex-wrap justify-center gap-8
            ${isMd ? 'relative flex-nowrap items-end h-80' : ''}
          `}
        >
          {templates.map(({ title, icon }, i) => (
            <motion.div
              key={title}
              custom={i}
              variants={variants}
              initial="initial"
              whileInView="animate"
              viewport={{ once:true, amount:0.5 }}
              className={`
                flex flex-col items-center justify-center
                bg-white shadow-lg cursor-pointer
                w-full sm:w-72 p-6 sm:p-8 rounded-2xl
                ${isMd ? 'absolute' : ''}
              `}
              style={{ zIndex: i === 1 ? 20 : 10 }}
              whileHover={isMd ? { scale:1.05, rotate:0, boxShadow:'0px 10px 20px rgba(0,0,0,0.15)' } : {}}
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
