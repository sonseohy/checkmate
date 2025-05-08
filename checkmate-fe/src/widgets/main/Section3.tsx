import { useMainCategories } from '@/features/categories/hooks/useCategories';
import { TemplateSection } from '@/widgets/common/TemplateSection';
import { categoryIconMap } from '@/shared/constants/categoryIconMap';

const Section3 = () => {
  const { data: mainCategories } = useMainCategories();

  const templates =
    mainCategories?.map((cat) => ({
      title: cat.name,
      icon: categoryIconMap[cat.name] || '', // fallback 처리도 가능
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
