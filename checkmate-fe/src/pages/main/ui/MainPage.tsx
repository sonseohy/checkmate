import { AppLayout } from '@/shared';
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
      mainClassName="px-4"
    ><main className="container mx-auto px-4 space-y-16">
        <Section1 />
        <Section2 />
        <Section3 />
        <Section4 />
        <Section5 />
        <Section6 />
      </main>
      </AppLayout>
    );
  };
  
  export default MainPage;