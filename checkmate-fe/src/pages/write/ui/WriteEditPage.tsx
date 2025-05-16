import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchExistingContract, saveContractInputs, useResetContractInputs,  TemplateField, TemplateSection, ContractInputSection } from '@/features/write';
import { WriteStickyBar } from '@/widgets/write';
import { LuTag } from 'react-icons/lu';
import Swal from 'sweetalert2';

const WriteEditPage: React.FC = () => {
  const { contractId } = useParams();
  const numericContractId = Number(contractId);
  const navigate = useNavigate();

  const [templateData, setTemplateData] = useState<any>(null);
  const [dependsOnStates, setDependsOnStates] = useState<Record<string, any>>({});
  const [tooltipField, setTooltipField] = useState<number | null>(null);

  const resetMutation = useResetContractInputs();

  useEffect(() => {
    const fetchData = async () => {
      if (!numericContractId) return;
      const res = await fetchExistingContract(numericContractId);
      const { contract, template, sections, values } = res;
      setTemplateData({ contract, template, sections });
      setDependsOnStates(values ?? {});
    };
    fetchData();
  }, [numericContractId]);

  /* blur 자동 저장 */
  const handleFieldBlur = async (fieldId: number, sectionId: number, value: string) => {
    try {
      await saveContractInputs({
        contractId: numericContractId,
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
        const options = typeof field.options === 'string' ? JSON.parse(field.options) : field.options;
        return (
          <div className="space-x-4">
            {options?.map((opt: string) => (
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
      case 'CHECKBOX':
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
      default:
        return <input type="text" {...commonProps} />;
    }
  };

  /* 입력값 초기화 */
  const handleReset = async () => {
    if (!numericContractId) return;
    const ok = await Swal.fire({
      icon: 'question',
      title: '모든 입력값을 초기화할까요?',
      text: '저장된 값이 모두 삭제됩니다.',
      showCancelButton: true,
      confirmButtonText: '초기화',
      cancelButtonText: '취소',
    }).then((r) => r.isConfirmed);

    if (!ok) return;

    try {
      const res = await resetMutation.mutateAsync(numericContractId);
      setDependsOnStates({});
      Swal.fire('완료', res.message, 'success');
    } catch {
      Swal.fire('실패', '초기화에 실패했습니다. 다시 시도해 주세요.', 'error');
    }
  };

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

    const inputPayload: ContractInputSection[] = templateData.sections.map((section: TemplateSection) => ({
      sectionId: section.id,
      fieldValues: section.fields
        .filter((field) => field.fieldKey in dependsOnStates)
        .map((field) => ({ fieldId: field.id, value: String(dependsOnStates[field.fieldKey] ?? '') })),
    }));

    try {
      const response = await saveContractInputs({ contractId: numericContractId, inputs: inputPayload });
      navigate(`/contract/${numericContractId}/preview`, {
        state: { contractId: numericContractId, templateName: templateData?.template.name, legalClausesBySection: response },
      });
    } catch (err) {
      Swal.fire({ icon: 'error', title: '저장 실패', text: '계약서를 저장하는 중 오류가 발생했습니다. 다시 시도해주세요.' });
    }
  };

  if (!templateData) {
    return <div className="flex items-center justify-center min-h-[300px] text-gray-600">계약서를 불러오는 중입니다...</div>;
  }

  return (
    <div className="container py-12 mx-auto">
      {/* 페이지 제목 */}
      <h1 className="text-4xl font-bold text-center mb-2">
        {templateData.template.name} 작성
      </h1>

      {/* ───── Sticky 툴바 ───── */}
      <WriteStickyBar
        onReset={handleReset}
        isResetting={resetMutation.isPending}
        submitTargetId="writeForm"
      />
      
      {/* 툴바와 첫 섹션 간의 간격 */}
      <div className="h-7" />

      <form id="writeForm" className="space-y-10 max-w-3xl mx-auto px-4 sm:px-6" onSubmit={handleSubmit}>
        {templateData.sections.map((section: TemplateSection) => (
          <section key={section.id} className="p-5 bg-[#F6F6F6] rounded-2xl relative">
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
      </form>
    </div>
  );
};

export default WriteEditPage;
