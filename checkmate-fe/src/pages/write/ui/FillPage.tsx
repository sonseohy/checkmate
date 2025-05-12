import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { MidCategory, SubCategory } from '@/features/categories';
import { useChecklist, ChecklistModal, useTemplate, TemplateField } from '@/features/write';
import { LuTag } from 'react-icons/lu';
import Swal from 'sweetalert2';

const renderInputField = (
  field: TemplateField,
  dependsOnStates: Record<string, any>,
  setDependsOnStates: React.Dispatch<React.SetStateAction<Record<string, any>>>
) => {
  // RADIO나 Checkbox의 경우, 어떤 값을 선택했을 때 연관이 있는 입력 필드만 작성 가능하도록 오픈
  const isDisabled = (() => {
    if (!field.dependsOn || field.inputType === 'RADIO') return false;
  
    if (field.dependsOn.includes('!=')) {
      const [key, notExpected] = field.dependsOn.split('!=');
      return dependsOnStates[key] === notExpected;
    }
  
    const [key, expected] = field.dependsOn.split('=');
    return dependsOnStates[key] !== expected;
  })();
  
  // 입력 불가 = isDisabled CSS 설정
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
    case 'NUMBER':
    case 'DATE':
      return (
        <input
          type={field.inputType.toLowerCase()}
          {...commonProps}
          value={dependsOnStates[field.fieldKey] ?? ''}
          onChange={(e) =>
            setDependsOnStates((prev) => ({
              ...prev,
              [field.fieldKey]: e.target.value,
            }))
          }
        />
      );
    // RADIO에 있는 옵션 중 하나가 선택되면, 그 옵션에 맞는 입력 란만 열림
    // 예시: 월세 / 전세 중 전세 선택 시, 월세 금액 입력 란은 열리지 않음
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
      // 체크박스 역시, 선택(체크됨)되었을 때만 관련 내용 입력 란이 열림
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
  const { categoryId, mainCategorySlug } = useParams<{ categoryId: string; mainCategorySlug: string }>();
  const numericCategoryId = Number(categoryId);
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

  // 입력 값을 저장하고 preview 페이지로 이동
  // RADIO 옵션 선택 안했을 시, 경고 창 띄움
  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const missingRequiredFields: string[] = [];

  for (const section of sections) {
    for (const field of section.fields) {
      const isDisabled = (() => {
        if (!field.dependsOn || field.inputType === 'RADIO') return false;
        if (field.dependsOn.includes('!=')) {
          const [key, notExpected] = field.dependsOn.split('!=');
          return dependsOnStates[key] === notExpected;
        }
        const [key, expected] = field.dependsOn.split('=');
        return dependsOnStates[key] !== expected;
      })();

      if (!isDisabled && field.required && !(field.fieldKey in dependsOnStates)) {
        missingRequiredFields.push(field.label);
      }
    }
  }
  if (missingRequiredFields.length > 0) {
    Swal.fire({
      icon: 'warning',
      title: '필수 항목이 누락되었습니다.',
      html: `<ul style="text-align:left; padding-left: 1em;">${missingRequiredFields
        .map((item) => `<li>• ${item}</li>`)
        .join('')}</ul>`,
      confirmButtonText: '확인',
    });
    return;
  }

  navigate(`/write/${mainCategorySlug}/${categoryId}/preview`);
};

  // Template 조회 후 처리
  const { data: template, isLoading, isError, error } = useTemplate(numericCategoryId);

  // 로딩 처리
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-gray-600">
        템플릿을 불러오는 중입니다...
      </div>
    );
  }

  // 에러 처리
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-red-600">
        템플릿을 불러오는 데 실패했습니다. <br />
        {(error as any)?.response?.data?.error?.message ?? '잠시 후 다시 시도해주세요.'}
      </div>
    );
  }

  const templateName = template?.template.name ?? '';
  const sections = template?.sections ?? [];
  return (
    <div className="container py-16 mx-auto">
      <h1 className="mb-8 text-4xl font-bold text-center">{templateName} 작성</h1>

      {/* 처음 작성하는 페이지 일 때, 체크리스트 모달 렌더링 */}
      {showModal && (
        <ChecklistModal checklist={checklist} onClose={() => setShowModal(false)} />
      )}

      {/* 각 섹션 별로 파트를 구분 */}
      <form className="space-y-10 max-w-3xl mx-auto px-4 sm:px-6" onSubmit={handleSubmit}>
        {sections.map((section) => (
          <section key={section.id} className="p-6 bg-[#F6F6F6] rounded-2xl shadow-xl relative">
            <div className="flex items-center gap-2 mb-4 relative">
              <h2 className="text-2xl font-bold">{section.name}</h2>
              {/* 섹션 별 추가 설명 */}
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

            {/* 체크가 되었을 때와 해제되었을 때를 구분하여 렌더링 */}
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

        {/* 전체 작성 후 작성하기 버튼 누르면 preview 페이지로 이동 */}
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