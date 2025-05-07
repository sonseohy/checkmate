import FeatureGridSection from '@/widgets/common/FeatureGridSection';
import UploadIcon from '@/assets/images/home/contract-upload.png';
import AnalysisIcon from '@/assets/images/home/ai-analysis.png';
import SummaryIcon from '@/assets/images/home/summary-feedback.png';

const steps = [
  {
    title: '계약서 업로드',
    desc: '웹에서 파일을 올려보세요.',
    icon: UploadIcon,
  },
  {
    title: 'AI 기반 계약서 분석',
    desc: 'AI가 핵심 조항을\n자동으로 분석해 드립니다.',
    icon: AnalysisIcon,
  },
  {
    title: '피드백 및 요약 제공',
    desc: '중요 내용을\n깔끔하게 요약해 드릴게요.',
    icon: SummaryIcon,
  },
];

const Section4 = () => (
  <FeatureGridSection
    sectionId="process"
    heading="복잡한 계약서도 걱정 마세요"
    items={steps}
  />
);

export default Section4;
