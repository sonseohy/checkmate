import { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { MidCategory, SubCategory } from '@/features/categories';
import { useChecklist, ChecklistModal, useTemplate, TemplateField } from '@/features/write';
import { LuTag } from 'react-icons/lu';

const renderInputField = (
  field: TemplateField,
  dependsOnStates: Record<string, any>,
  setDependsOnStates: React.Dispatch<React.SetStateAction<Record<string, any>>>
) => {
  const isDisabled = (() => {
    if (!field.dependsOn || field.inputType === 'RADIO') return false;
  
    if (field.dependsOn.includes('!=')) {
      const [key, notExpected] = field.dependsOn.split('!=');
      return dependsOnStates[key] === notExpected;
    }
  
    const [key, expected] = field.dependsOn.split('=');
    return dependsOnStates[key] !== expected;
  })();

  const commonProps = {
    id: field.fieldKey,
    name: field.fieldKey,
    required: field.required,
    className: `w-full p-2 rounded-md border ${
      isDisabled ? 'bg-gray-50 text-gray-400 border-gray-300' : 'bg-white border-gray-400'
    }`,
    disabled: isDisabled,
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
              <input
                type="radio"
                name={field.fieldKey}
                value={opt}
                checked={dependsOnStates[field.fieldKey] === opt}
                onChange={() =>
                  setDependsOnStates((prev) => ({ ...prev, [field.fieldKey]: opt }))
                }
                className="mr-1"
              />
              {opt}
            </label>
          ))}
        </div>
      );
      case 'CHECKBOX':
        return (
          <input
            type="checkbox"
            id={field.fieldKey}
            name={field.fieldKey}
            className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            checked={dependsOnStates[field.fieldKey] === '1'}
            onChange={() =>
              setDependsOnStates((prev) => ({
                ...prev,
                [field.fieldKey]: prev[field.fieldKey] === '1' ? '0' : '1',
              }))
            }
          />
        );
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

  const [tooltipField, setTooltipField] = useState<number | null>(null);
  const [dependsOnStates, setDependsOnStates] = useState<Record<string, any>>({});

  return (
    <div className="container py-16 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-center">{templateName} 작성</h1>

      {showModal && (
        <ChecklistModal checklist={checklist} onClose={() => setShowModal(false)} />
      )}

      <form className="space-y-10 max-w-3xl mx-auto px-4 sm:px-6">
        {sections.map((section) => (
          <section key={section.id} className="p-6 bg-[#F6F6F6] rounded-2xl shadow-xl relative">
            <div className="flex items-center gap-2 mb-4 relative">
              <h2 className="text-xl font-bold">{section.name}</h2>
              {section.description && (
                <div className="relative">
                  <button
                    type="button"
                    className="text-gray-500 cursor-pointer"
                    onClick={() =>
                      setTooltipField((prev) => (prev === section.id ? null : section.id))
                    }
                  >
                    <LuTag className="w-4 h-4" />
                  </button>
                  {tooltipField === section.id && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded shadow z-10 whitespace-nowrap">
                      {section.description}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid gap-4">
              {section.fields.map((field) => (
                <div key={field.fieldKey} className={field.inputType === 'CHECKBOX' ? 'flex items-center' : 'space-y-1'}>
                  <label 
                    htmlFor={field.fieldKey} 
                    className={`${field.inputType === 'CHECKBOX' ? 'order-2' : 'block'} font-medium`}
                  >
                    {field.label}
                  </label>
                  {field.inputType === 'CHECKBOX' ? 
                    <div className="order-1 mr-1">{renderInputField(field, dependsOnStates, setDependsOnStates)}</div> : 
                    renderInputField(field, dependsOnStates, setDependsOnStates)
                  }
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