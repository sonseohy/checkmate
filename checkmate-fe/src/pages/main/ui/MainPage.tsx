
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
<>
      <div className="container mx-auto">
        <Section1 />
      </div>

      <Section2 />
      <Section3 />


      <Section4 />
      <Section5 />
      <div className="container mx-auto">
   
        <Section6 />
      </div>
      </>

  )
}

export default MainPage
