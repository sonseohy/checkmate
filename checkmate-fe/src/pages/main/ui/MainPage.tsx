import { useGeolocation } from '@/features/mypage';
import {
  Section1,
  Section2,
  Section3,
  Section4,
  Section5,
  Section6,
} from '@/widgets/main';

const MainPage = () => {
  useGeolocation();
  return (
    <>
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 />
    </>
  );
};

export default MainPage;
