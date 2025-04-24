import { AppLayout } from '@/shared';
import {
  Section1,
  Section2,
  Section3,
  Section4,
  Section5,
  Section6,
} from '@/widgets/main';

const MainPage = () => {
  return (
    <AppLayout
      headerProps={{ className: 'bg-white shadow' }}
      mainClassName="px-4 snap-y snap-mandatory overflow-y-auto"
    >
      <div className="container mx-auto">
        {[Section1, Section2, Section3, Section4, Section5, Section6].map(
          (Section, idx) => (
            <div
              key={idx}
              className="
                snap-start
                h-[calc(100vh-4rem)]  
              "
            >
              <Section />
            </div>
          )
        )}
      </div>
    </AppLayout>
  );
};

export default MainPage;