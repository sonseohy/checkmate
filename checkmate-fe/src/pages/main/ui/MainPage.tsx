import { AppLayout } from '@/shared'
import {
  Section1,
  Section2,
  Section3,
  Section4,
  Section5,
  Section6,
} from '@/widgets/main'

const MainPage = () => {
  return (
    <AppLayout
      headerProps={{ className: 'bg-white shadow' }}
      mainClassName="px-4 snap-y snap-mandatory overflow-y-auto"
    >
      <div className="container mx-auto">
        <Section1 />
      </div>

      <Section2 />

      <div className="container mx-auto">
        <Section3 />
      </div>

      <Section4 />

      <div className="container mx-auto">
        <Section5 />
        <Section6 />
      </div>
    </AppLayout>
  )
}

export default MainPage
