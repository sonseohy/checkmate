import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchExistingContract, saveContractInputs, useResetContractInputs,  TemplateField, TemplateSection, ContractInputSection, parseOptions } from '@/features/write';
import { WriteStickyBar } from '@/widgets/write';
import { LuTag } from 'react-icons/lu';
import Swal from 'sweetalert2';
import { ResidentIdInput, PhoneNumberInput, MoneyInput, DayInput, AreaInput, AddressInput, DateFieldInput, } from '@/shared';

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
  const handleFieldBlur = async (
  fieldId: number,
  sectionId: number,
  value: string | number
) => {
  if (!contractId || !templateData) return;

  const allFields: TemplateField[] = templateData.sections.flatMap(
    (s: TemplateSection) => s.fields
  );
  const matchedField = allFields.find((f) => f.id === fieldId);
  const fieldKey = matchedField?.fieldKey;

  if (!fieldKey) {
    console.warn('fieldKey를 찾을 수 없음 (fieldId:', fieldId, ')');
    return;
  }

  // 숫자 입력 필드일 경우, 숫자만 추출해서 문자열로 변환
  const normalizedValue =
    matchedField?.inputType === 'NUMBER'
      ? String(value).replace(/[^0-9]/g, '') || '0'
      : String(value ?? '');

  setDependsOnStates((prev) => ({
    ...prev,
    [fieldKey]: normalizedValue,
  }));

  // 로그 추가: 서버에 보낼 실제 데이터 확인
  console.log('자동 저장 요청 payload', {
    contractId,
    inputs: [
      {
        sectionId,
        fieldValues: [
          {
            fieldId,
            value: normalizedValue,
          },
        ],
      },
    ],
  });

  try {
    await saveContractInputs({
      contractId: numericContractId,
      inputs: [
        {
          sectionId,
          fieldValues: [
            {
              fieldId,
              value: normalizedValue,
            },
          ],
        },
      ],
    });
  } catch (err: any) {
    console.error('자동 저장 실패:', err.response?.data || err);
  }
};

  const shouldShowField = (field: TemplateField) => {
    if (!field.dependsOn) return true;

    // checkbox의 다중 선택에 대응하기 위한 로직
    const [key, expected] = field.dependsOn.includes('!=')
      ? field.dependsOn.split('!=')
      : field.dependsOn.split('=');

    const fieldValue = dependsOnStates[key];

    // JSON 배열이면 checkbox 멀티 선택값으로 가정
    if (fieldValue?.startsWith?.('[')) {
      try {
        const values = JSON.parse(fieldValue);
        return Array.isArray(values)
          ? field.dependsOn.includes('!=')
            ? !values.includes(expected)
            : values.includes(expected)
          : false;
      } catch {
        return false;
      }
    }

    // 일반 문자열 비교 (RADIO 등)
    return field.dependsOn.includes('!=')
      ? fieldValue !== expected
      : fieldValue === expected;
  };

  const renderInputField = (field: TemplateField, sectionId: number) => {
    const fieldKey = field.fieldKey;
    const value = dependsOnStates[fieldKey] ?? '';

    // 키워드 포함 여부 헬퍼
    const includesAny = (label: string, keywords: string[]) =>
      keywords.some((k) => label.includes(k));

    // 최대 입력 길이 설정 (label 기준)
    const getMaxLength = (label: string): number => {
      if (includesAny(label, ['전화번호', '연락처'])) return 13;
      if (includesAny(label, ['주민등록번호'])) return 13;
      if (includesAny(label, ['이름', '성명'])) return 50;
      if (includesAny(label, ['주소'])) return 100;
      return 100;
    };  

    const isResidentIdLabel = includesAny(field.label, ['주민등록번호']);
    const isPhoneLabel = includesAny(field.label, ['전화번호', '연락처']);
    const isDayLabel = includesAny(field.label, ['지불일', '지급시기']);
    const isAreaLabel = field.label.trim().endsWith('면적');
    const isAddressLabel = includesAny(field.label, ['주소', '소재지']) && !field.label.includes('상세');

    // 공통 입력 속성
    const commonProps = {
      id: fieldKey,
      name: fieldKey,
      required: field.required,
      className: 'w-full p-2 rounded-md border bg-white border-gray-400',
      onBlur: (e: React.FocusEvent<HTMLInputElement>) =>
        handleFieldBlur(field.id, sectionId, e.target.value),
    };

    // 특수 필드 분기 처리
    if (isResidentIdLabel) {
      return (
        <ResidentIdInput
          value={value}
          onChange={(v) => setDependsOnStates((p) => ({ ...p, [fieldKey]: v }))}
          onComplete={(v) => handleFieldBlur(field.id, sectionId, v)}
        />
      );
    }
    if (isPhoneLabel) {
      return (
        <PhoneNumberInput
          value={value}
          onChange={(v) => setDependsOnStates((p) => ({ ...p, [fieldKey]: v }))}
          onBlur={() => handleFieldBlur(field.id, sectionId, value)}
        />
      );
    }
    if (isDayLabel) {
      return (
        <DayInput
          value={value}
          onChange={(v) => setDependsOnStates((p) => ({ ...p, [fieldKey]: v }))}
          onBlur={() => handleFieldBlur(field.id, sectionId, value)}
        />
      );
    }
    if (isAreaLabel) {
      return (
        <AreaInput
          value={value}
          onChange={(v) => setDependsOnStates((p) => ({ ...p, [fieldKey]: v }))}
          onBlur={() => handleFieldBlur(field.id, sectionId, value)}
        />
      );
    }
    if (isAddressLabel) {
      return (
        <AddressInput
          value={value}
          onChange={(v) => {
            setDependsOnStates((p) => ({ ...p, [fieldKey]: v }));
            handleFieldBlur(field.id, sectionId, v); // 최신 v로 바로 호출
          }}
        />
      );
    }

    if (['monthly_rent', 'deposit', 'earnest_money', 'balance', 'total_amount_paid', 'meal_amount', 'bonus_amount', 'transportation_fee_amount', 'other_allowances_1', 'other_allowances_2', 'incentive_amount', 'continuous_incentive_amount', 'provisional_deposit'].includes(fieldKey)) {
      return (
        <MoneyInput
          value={value}
          onChange={(v) => {
            setDependsOnStates((prev) => ({ ...prev, [fieldKey]: v }));
            handleFieldBlur(field.id, sectionId, v); // 여기서 콤마 없는 v로 저장
          }}
        />
      );
    }

    switch (field.inputType) {
      case 'TEXT': {
        return (
          <input
            type="text"
            maxLength={getMaxLength(fieldKey)}
            {...commonProps}
            value={value}
            onChange={(e) =>
              setDependsOnStates((p) => ({ ...p, [fieldKey]: e.target.value }))
            }
          />
        );
      }

      case 'NUMBER': {
        return (
          <input
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={getMaxLength(fieldKey)}
            {...commonProps}
            value={value}
            onChange={(e) =>
              setDependsOnStates((p) => ({ ...p, [fieldKey]: e.target.value }))
            }
          />
        );
      }
      case 'DATE':
        return (
          <DateFieldInput
            value={value}
            onChange={(v) => setDependsOnStates((p) => ({ ...p, [fieldKey]: v }))}
            onBlur={() => handleFieldBlur(field.id, sectionId, value)}
          />
        );

      case 'RADIO': {
        const opts = parseOptions(field.options);
        return (
          <div className="space-x-4">
            {opts.map((opt) => (
              <label key={opt} className="inline-flex items-center">
                <input
                  type="radio"
                  name={fieldKey}
                  value={opt}
                  checked={value === opt}
                  onChange={() => {
                    setDependsOnStates((p) => ({ ...p, [fieldKey]: opt }));
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
        const opts = parseOptions(field.options);

        if (opts.length) {
          const selected: string[] = value ? JSON.parse(value) : [];

          const toggle = (item: string) => {
            const next = selected.includes(item)
              ? selected.filter((v) => v !== item)
              : [...selected, item];

            setDependsOnStates((p) => ({
              ...p,
              [fieldKey]: JSON.stringify(next),
            }));
            handleFieldBlur(field.id, sectionId, JSON.stringify(next));
          };

          return (
            <div className="space-y-2">
              {opts.map((opt) => (
                <div key={opt} className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(opt)}
                      onChange={() => toggle(opt)}
                    />
                    {opt}
                  </label>
                </div>
              ))}
            </div>
          );
        }

        return (
          <input
            type="checkbox"
            className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            checked={value === '1'}
            onChange={() => {
              const v = value === '1' ? '0' : '1';
              setDependsOnStates((p) => ({ ...p, [fieldKey]: v }));
              handleFieldBlur(field.id, sectionId, v);
            }}
          />
        );
      }

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

    /* 2. 필수 누락 체크 보강 ★ */
    const missing: string[] = [];

    templateData?.sections.forEach((sec: TemplateSection) =>
      sec.fields.forEach((f: TemplateField) => {
        if (!f.required || !shouldShowField(f)) return;

        const v = dependsOnStates[f.fieldKey];
        const isEmpty =
          v === undefined ||
          v === '' ||
          (f.inputType === 'CHECKBOX' &&
            parseOptions(f.options).length > 0 &&
            JSON.parse(v ?? '[]').length === 0);

        if (isEmpty) missing.push(f.label);
      }),
    );

    if (missing.length) {
      Swal.fire({
        icon: 'warning',
        title: '필수 항목 누락',
        html:
          '<ul style="text-align:left;padding-left:1em;">' +
          missing.map((m) => `<li>• ${m}</li>`).join('') +
          '</ul>',
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
              {section.fields.filter(shouldShowField).map((field) => {
                const isCheckbox = field.inputType === 'CHECKBOX';
                const options = parseOptions(field.options);
                const isMultiCheckbox = isCheckbox && options.length > 0;

                return (
                  <div
                    key={field.fieldKey}
                    className={
                      isCheckbox
                        ? isMultiCheckbox
                          ? 'space-y-1' // 여러 옵션: 위아래 구조
                          : 'flex items-center' // 단일 옵션: 옆으로
                        : 'space-y-1' // TEXT, NUMBER 등은 기존대로
                    }
                  >
                    {/* ====== CHECKBOX ====== */}
                    {isCheckbox ? (
                      isMultiCheckbox ? (
                        <>
                          <label htmlFor={field.fieldKey} className="font-medium block">
                            {field.label}
                          </label>
                          <div>{renderInputField(field, section.id)}</div>
                        </>
                      ) : (
                        <>
                          {renderInputField(field, section.id)}
                          <label htmlFor={field.fieldKey} className="font-medium">
                            {field.label}
                          </label>
                        </>
                      )
                    ) : (
                      /* ====== 일반 필드 (TEXT, NUMBER 등) ====== */
                      <>
                        <label htmlFor={field.fieldKey} className="font-medium block">
                          {field.label}
                        </label>
                        {renderInputField(field, section.id)}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </form>
    </div>
  );
};

export default WriteEditPage;
