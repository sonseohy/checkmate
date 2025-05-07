import FeatureGridSection from '@/widgets/common/FeatureGridSection';
import AutoWriteIcon from '@/assets/images/home/auto-write.png';
import ESignIcon from '@/assets/images/home/e-sign.png';
import DocManageIcon from '@/assets/images/home/doc-manage.png';

const features = [
  {
    title: '자동 작성',
    desc: '필요한 정보만 입력하면\n계약서를 자동으로 완성해 줍니다.',
    icon: AutoWriteIcon,
  },
  {
    title: '전자 서명',
    desc: '안전한 전자 서명으로 언제든지\n어디서나 계약을 체결할 수 있습니다.',
    icon: ESignIcon,
  },
  {
    title: '문서 관리',
    desc: '모든 계약서를 한 곳에 모아두고\n키워드로 빠르게 검색하세요.',
    icon: DocManageIcon,
  },
];

const Section2 = () => (
  <FeatureGridSection
    sectionId="features"
    heading="어려운 계약서도 걱정 마세요"
    items={features}
  />
);

export default Section2;
