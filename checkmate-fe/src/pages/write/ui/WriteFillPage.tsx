import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { MidCategory, SubCategory } from '@/features/categories';
import { useChecklist, ChecklistModal, CreateContractTemplateResponse, useCreateContractTemplate, TemplateField, ContractInputSection, saveContractInputs, fetchExistingContract } from '@/features/write';
import { getUserInfo } from '@/entities/user';
import { LuTag } from 'react-icons/lu';
import Swal from 'sweetalert2';

const WriteFillPage: React.FC<{ mode: 'create' | 'edit' }> = ({ mode }) => {
  const { categoryId, contractId: paramContractId } = useParams();
  const numericCategoryId = categoryId ? Number(categoryId) : null;
  const numericContractId = paramContractId ? Number(paramContractId) : null;
  const navigate = useNavigate();

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
  // LuTag 아이콘에 정보 내용 Tolltip 연결
  const [tooltipField, setTooltipField] = useState<number | null>(null);
  const [dependsOnStates, setDependsOnStates] = useState<Record<string, any>>({});
  // 생성되는 contractId 및 템플릿 입력 값 저장
  const [contractId, setContractId] = useState<number | null>(null);
  const [templateData, setTemplateData] = useState<CreateContractTemplateResponse | null>(null);

  const { mutate } = useCreateContractTemplate();

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserInfo();
      if (!user?.user_id) return;

      if (mode === 'create' && numericCategoryId) {
        mutate(
          { categoryId: numericCategoryId, userId: user.user_id },
          {
            onSuccess: (res) => {
              setContractId(res.contract.id);
              setTemplateData({ template: res.template, sections: res.sections, contract: res.contract });
            },
          }
        );
      } else if (mode === 'edit' && numericContractId) {
        const res = await fetchExistingContract(numericContractId);
        const { contract, template, sections, values } = res;
        setContractId(contract.id);
        setTemplateData({ contract, template, sections });
        setDependsOnStates(values ?? {});
      }
    };

    fetchData();
  }, [mode, numericCategoryId, numericContractId]);

  const handleFieldBlur = async (fieldId: number, sectionId: number, value: string) => {
    if (!contractId) return;
    try {
      await saveContractInputs({
        contractId,
        inputs: [{ sectionId, fieldValues: [{ fieldId, value }] }],
      });
    } catch (error) {
      console.error('자동 저장 실패:', error);
    }
  };

  const shouldShowField = (field: TemplateField): boolean => {
    if (!field.dependsOn) return true;
    if (field.dependsOn.includes('!=')) {
      const [key, notExpected] = field.dependsOn.split('!=');
      return dependsOnStates[key] !== notExpected;
    }
    const [key, expected] = field.dependsOn.split('=');
    return dependsOnStates[key] === expected;
  };

  const renderInputField = (field: TemplateField, sectionId: number) => {
    const commonProps = {
      id: field.fieldKey,
      name: field.fieldKey,
      required: field.required,
      className: 'w-full p-2 rounded-md border bg-white border-gray-400',
      onBlur: (e: React.FocusEvent<HTMLInputElement>) => handleFieldBlur(field.id, sectionId, e.target.value),
    };

    switch (field.inputType) {
      case 'TEXT':
      case 'NUMBER':
      case 'DATE':
        return (
          <input
            type={field.inputType.toLowerCase()}
            {...commonProps}
            value={dependsOnStates[field.fieldKey] ?? ''}
            onChange={(e) => setDependsOnStates((prev) => ({ ...prev, [field.fieldKey]: e.target.value }))}
          />
        );
      case 'RADIO': {
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
                  onChange={() => {
                    setDependsOnStates((prev) => ({ ...prev, [field.fieldKey]: opt }));
                    handleFieldBlur(field.id, sectionId, opt);
                  }}
                  className="mr-1"
                />
                {opt}
              </label>
            ))}
          </div>
        );
      }
      case 'CHECKBOX': {
        return (
          <input
            type="checkbox"
            id={field.fieldKey}
            name={field.fieldKey}
            className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            checked={dependsOnStates[field.fieldKey] === '1'}
            onChange={() => {
              const newValue = dependsOnStates[field.fieldKey] === '1' ? '0' : '1';
              setDependsOnStates((prev) => ({ ...prev, [field.fieldKey]: newValue }));
              handleFieldBlur(field.id, sectionId, newValue);
            }}
          />
        );
      }
      default:
        return <input type="text" {...commonProps} />;
    }
  };

  // 입력 값을 저장하고 preview 페이지로 이동
  // RADIO 옵션 선택 안했을 시, 경고 창 띄움
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missingRequiredFields: string[] = [];

    for (const section of templateData?.sections ?? []) {
      for (const field of section.fields) {
        if (!shouldShowField(field) || !field.required) continue;
        if (!(field.fieldKey in dependsOnStates)) missingRequiredFields.push(field.label);
      }
    }

    if (missingRequiredFields.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: '필수 항목이 누락되었습니다.',
        html: `<ul style="text-align:left; padding-left: 1em;">${missingRequiredFields.map((item) => `<li>• ${item}</li>`).join('')}</ul>`,
        confirmButtonText: '확인',
      });
      return;
    }

    if (contractId && templateData) {
      const inputPayload: ContractInputSection[] = templateData.sections.map((section) => ({
        sectionId: section.id,
        fieldValues: section.fields
          .filter((field) => field.fieldKey in dependsOnStates)
          .map((field) => ({ fieldId: field.id, value: String(dependsOnStates[field.fieldKey] ?? '') })),
      }));

      try {
        const response = await saveContractInputs({ contractId, inputs: inputPayload });
        navigate(`/contract/${contractId}/preview`, {
          state: { contractId, legalClausesBySection: response },
        });
      } catch (err) {
        Swal.fire({ icon: 'error', title: '저장 실패', text: '계약서를 저장하는 중 오류가 발생했습니다. 다시 시도해주세요.' });
      }
    }
  };

  if (!templateData) {
    return <div className="flex items-center justify-center min-h-[300px] text-gray-600">템플릿을 불러오는 중입니다...</div>;
  }

  const templateName = templateData.template.name;
  const sections = templateData.sections;
  
  return (
    <div className="container py-16 mx-auto">
      <h1 className="mb-8 text-4xl font-bold text-center">{templateName} 작성</h1>
      {showModal && <ChecklistModal checklist={checklist} onClose={() => setShowModal(false)} />}
      <form className="space-y-10 max-w-3xl mx-auto px-4 sm:px-6" onSubmit={handleSubmit}>
        {sections.map((section) => (
          <section key={section.id} className="p-6 bg-[#F6F6F6] rounded-2xl shadow-xl relative">
            <div className="flex items-center gap-2 mb-4 relative">
              <h2 className="text-2xl font-bold">{section.name}</h2>
              {section.description && (
                <div className="relative">
                  <button type="button" className="text-gray-500 cursor-pointer" onClick={() => setTooltipField((prev) => (prev === section.id ? null : section.id))}>
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
              {section.fields.filter(shouldShowField).map((field) => (
                <div key={field.fieldKey} className={field.inputType === 'CHECKBOX' ? 'flex items-center' : 'space-y-1'}>
                  <label htmlFor={field.fieldKey} className={`${field.inputType === 'CHECKBOX' ? 'order-2' : 'block'} font-medium`}>
                    {field.label}
                  </label>
                  {field.inputType === 'CHECKBOX' ? (
                    <div className="order-1 mr-1">{renderInputField(field, section.id)}</div>
                  ) : (
                    renderInputField(field, section.id)
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
        <div className="text-center">
          <button type="submit" className="px-6 py-3 mt-8 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700">
            계약서 작성하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default WriteFillPage;