import { useMainCategories } from '@/features/categories/hooks/useCategories';
import { TemplateSection } from '@/widgets/common/TemplateSection';
import { categoryIconMap } from '@/shared/constants/categoryIconMap';

const Section5 = () => {
  const { data: mainCategories } = useMainCategories();

  const templates =
    mainCategories?.map((cat) => ({
      title: cat.name,
      icon: categoryIconMap[cat.name] || '',
    })) || [];

  return (
    <TemplateSection
      sectionId="templates-analyze"
      heading="함께 봐드릴게요"
      templates={templates}
    />
  );
};

export default Section5;
