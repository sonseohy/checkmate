import { useMainCategories } from '@/features/categories/hooks/useCategories';
import TemplateSectionSkeleton from '@/widgets/common/TemplateSectionSkeleton';
import { TemplateSection } from '@/widgets/common/TemplateSection';
import { categoryIconMap } from '@/shared/constants/categoryIconMap';

const Section3: React.FC = () => {
  const { data: mainCategories, isLoading } = useMainCategories();

  if (isLoading) return <TemplateSectionSkeleton sectionId="templates-write" />;

  const templates =
    mainCategories?.map((cat) => ({
      title: cat.name,
      icon: categoryIconMap[cat.name] || '',
    })) || [];

  return (
    <TemplateSection
      sectionId="templates-write"
      heading="함께 써드릴게요"
      templates={templates}
    />
  );
};

export default Section3;
