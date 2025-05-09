import { useState } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import { MidCategory, SubCategory } from '@/features/categories';
import { useChecklist, ChecklistModal, useTemplate, TemplateField } from '@/features/write';
import { LuTag } from 'react-icons/lu';

const renderInputField = (field: TemplateField) => {
  const commonProps = {
    id: field.fieldKey,
    name: field.fieldKey,
    required: field.required,
    className: 'w-full p-2 border rounded-md',
  };

  switch (field.inputType) {
    case 'TEXT':
      return <input type="text" {...commonProps} />;
    case 'NUMBER':
      return <input type="number" {...commonProps} />;
    case 'DATE':
      return <input type="date" {...commonProps} />;
    case 'RADIO':
      const radioOptions = Array.isArray(field.options)
        ? field.options
        : typeof field.options === 'string'
        ? JSON.parse(field.options)
        : [];
    
      return (
        <div className="space-x-4">
          {radioOptions.map((opt: string) => (
            <label key={opt} className="inline-flex items-center">
              <input type="radio" value={opt} {...commonProps} className="mr-1" />
              {opt}
            </label>
          ))}
        </div>
      );
    case 'CHECKBOX':
      return <input type="checkbox" {...commonProps} className="w-5 h-5" />;
    default:
      return <input type="text" {...commonProps} />;
  }
};

const FillPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const numericCategoryId = Number(categoryId);

  const { state } = useLocation() as {
    state?: {
      selectedMid?: MidCategory;
      selectedSub?: SubCategory;
      isNew?: boolean;
    };
  };

  const midCategoryId = state?.selectedMid?.id;
  const { data: checklist = [] } = useChecklist(midCategoryId);
  const [showModal, setShowModal] = useState(state?.isNew ?? true);

  const { data: template } = useTemplate(numericCategoryId);
  const templateName = template?.template.name ?? '';
  const sections = template?.sections ?? [];

  return (
    <div className="container py-16 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-center">{templateName} 작성</h1>

      {showModal && (
        <ChecklistModal checklist={checklist} onClose={() => setShowModal(false)} />
      )}

      <form className="space-y-10 max-w-3xl mx-auto px-4 sm:px-6">
        {sections.map((section) => (
          <section key={section.id} className="p-4 bg-[#F6F6F6] rounded-2xl shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-bold">{section.name}</h2>
              {section.description && (
                <span
                  className="relative group text-gray-500 cursor-pointer"
                  title={section.description}
                >
                  <LuTag className="w-4 h-4" />
                </span>
              )}
            </div>

            <div className="grid gap-4">
              {section.fields.map((field) => (
                <div key={field.fieldKey} className="space-y-1">
                  <label htmlFor={field.fieldKey} className="font-medium">
                    {field.label}
                  </label>
                  {renderInputField(field)}
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-3 mt-8 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            계약서 작성하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default FillPage;
