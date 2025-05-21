import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { MidCategory, SubCategory } from '@/features/categories';
import {
  useChecklist,
  ChecklistModal,
  useCreateContractTemplate,
  TemplateField,
  ContractInputSection,
  saveContractInputs,
  CreateContractTemplateResponse,
  useResetContractInputs,
  parseOptions,
} from '@/features/write';
import { getUserInfo } from '@/entities/user';
import { WriteStickyBar } from '@/widgets/write';
import { LuTag } from 'react-icons/lu';
import Swal from 'sweetalert2';
import {
  TimeInput,
  ResidentIdInput,
  PhoneNumberInput,
  MoneyInput,
  DayInput,
  AreaInput,
  AddressInput,
  DateFieldInput,
} from '@/shared';

// multi-checkbox 부모 필드 감지를 위한 helper
const isMultiCheckboxField = (field: TemplateField) =>
  field.inputType === 'CHECKBOX' && parseOptions(field.options).length > 0;

const WriteFillPage: React.FC = () => {
  /* 라우팅 & 기본 준비 */
  const { categoryId } = useParams();
  const numericCategoryId = Number(categoryId);
  const navigate = useNavigate();
  const { state } = useLocation() as {
    state?: {
      selectedMid?: MidCategory;
      selectedSub?: SubCategory;
      isNew?: boolean;
    };
  };

  /* 체크리스트 */
  const midCategoryId = state?.selectedMid?.id;
  const { data: checklist = [] } = useChecklist(midCategoryId);

  /* 로컬 상태 */
  const [showModal, setShowModal] = useState(state?.isNew ?? true);
  const [tooltipField, setTooltipField] = useState<number | null>(null);
  const [dependsOnStates, setDependsOnStates] = useState<Record<string, any>>(
    {},
  );
  const [contractId, setContractId] = useState<number | null>(null);
  const [templateData, setTemplateData] =
    useState<CreateContractTemplateResponse | null>(null);

  const saveMultiCheckbox = async (
    field: TemplateField,
    sectionId: number,
    selected: string[],
  ) => {
    if (!contractId) return;

    // JSON 문자열이 아니라, 값 하나당 하나씩!
    const fieldValues = selected.map((opt) => ({
      fieldId: field.id,
      value: opt,
    }));

    try {
      await saveContractInputs({
        contractId,
        inputs: [
          {
            sectionId,
            fieldValues,
          },
        ],
      });
    } catch (e: any) {
      // console.error('멀티체크박스 저장 실패:', e.response?.data || e);
    }
  };

  /* 계약서 생성 */
  const { mutate } = useCreateContractTemplate();
  useEffect(() => {
    const createOrLoad = async () => {
      const user = await getUserInfo();
      if (!user?.user_id || !numericCategoryId) return;
      mutate(
        { categoryId: numericCategoryId, userId: user.user_id },
        {
          onSuccess: (res) => {
            // 공통 세팅
            setContractId(res.contract.id);
            setTemplateData({
              contract: res.contract,
              template: res.template,
              sections: res.sections,
            });
            setDependsOnStates(res.values ?? {});
            /* 작성중인 계약서가 있다면 이어서 작성하는 페이지로 라우트 */
            if (res.values && Object.keys(res.values).length > 0) {
              navigate(`/write/edit/${res.contract.id}`, { replace: true });
            }
          },
        },
      );
    };

    createOrLoad();
  }, [numericCategoryId, mutate, navigate]);

  /* 입력 blur → 자동 저장 */
  const handleFieldBlur = async (
    fieldId: number,
    sectionId: number,
    value: string,
  ) => {
    if (!contractId || !templateData) return;
    const allFields: TemplateField[] = templateData.sections.flatMap(
      (s) => s.fields,
    );
    const matchedField = allFields.find((f) => f.id === fieldId);
    const fieldKey = matchedField?.fieldKey;
    if (!fieldKey) return;
    const normalizedValue: string =
      matchedField?.inputType === 'NUMBER'
        ? value.replace(/[^0-9]/g, '')
        : value;
    setDependsOnStates((prev) => ({ ...prev, [fieldKey]: normalizedValue }));
    try {
      await saveContractInputs({
        contractId,
        inputs: [
          {
            sectionId,
            fieldValues: [{ fieldId, value: normalizedValue }],
          },
        ],
      });
    } catch (err: any) {
      // console.error('자동 저장 실패:', err.response?.data || err);
    }
  };

  /* 계약서 초기화 */
  const resetMutation = useResetContractInputs();
  const handleReset = async () => {
    if (!contractId) return;
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
      const res = await resetMutation.mutateAsync(contractId);
      setDependsOnStates({}); // 상태 비우기
      Swal.fire('완료', res.message ?? '초기화되었습니다.', 'success');
    } catch (err: any) {
      Swal.fire(
        '실패',
        err?.response?.data?.error?.message ?? '초기화에 실패했습니다.',
        'error',
      );
    }
  };

  /* 렌더링 보조 */
  const shouldShowField = (field: TemplateField) => {
    if (!field.dependsOn) return true;
    const [key, expected] = field.dependsOn.includes('!=')
      ? field.dependsOn.split('!=')
      : field.dependsOn.split('=');
    const fieldValue = dependsOnStates[key];
    if (typeof fieldValue === 'string' && fieldValue.startsWith('[')) {
      try {
        const arr: string[] = JSON.parse(fieldValue);
        return field.dependsOn.includes('!=')
          ? !arr.includes(expected)
          : arr.includes(expected);
      } catch {
        return false;
      }
    }
    return field.dependsOn.includes('!=')
      ? fieldValue !== expected
      : fieldValue === expected;
  };

  const renderInputField = (field: TemplateField, sectionId: number) => {
    const fieldKey = field.fieldKey;
    const value = dependsOnStates[fieldKey] ?? '';

    // helper: whether label includes any of keywords
    const includesAny = (label: string, keywords: string[]) =>
      keywords.some((k) => label.includes(k));

    // maxLength by label
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
    const isAddressLabel =
      includesAny(field.label, ['주소', '소재지']) &&
      !field.label.includes('상세');
    const isTimeLabel = field.label.trim().endsWith('시간');

    // 주민등록번호
    if (isResidentIdLabel) {
      return (
        <ResidentIdInput
          value={value}
          onChange={(v) => setDependsOnStates((p) => ({ ...p, [fieldKey]: v }))}
          onComplete={(v) => handleFieldBlur(field.id, sectionId, v)}
        />
      );
    }

    // 전화번호
    if (isPhoneLabel) {
      return (
        <PhoneNumberInput
          value={value}
          onChange={(v) => setDependsOnStates((p) => ({ ...p, [fieldKey]: v }))}
          onBlur={() => handleFieldBlur(field.id, sectionId, value)}
        />
      );
    }

    // 금액 입력
    const keyBased = [
      'monthly_rent',
      'deposit',
      'earnest_money',
      'balance',
      'total_amount_paid',
      'basic_amount',
      'meal_amount',
      'bonus_amount',
      'transportation_fee_amount',
      'other_allowances_1',
      'other_allowances_2',
      'incentive_amount',
      'continuous_incentive_amount',
      'provisional_deposit',
      'maintenance_cost_total',
      'maintenance_common_fee',
      'maintenance_electric_fee',
      'maintenance_water_fee',
      'maintenance_gas_fee',
      'maintenance_heating_fee',
      'maintenance_internet_fee',
      'maintenance_tv_fee',
      'maintenance_other_fee',
    ].includes(fieldKey);
    const labelBased = ['금', '비', '금액'].some((suffix) =>
      field.label.endsWith(suffix),
    );
    if (keyBased || labelBased) {
      return (
        <MoneyInput
          value={value}
          onChange={(v) => setDependsOnStates((p) => ({ ...p, [fieldKey]: v }))}
          onBlur={() => handleFieldBlur(field.id, sectionId, value)}
        />
      );
    }

    // 일(Day) 입력 — inputType이 NUMBER이고, 라벨에 “지불일” 또는 “지급시기”가 있을 때만
    if (
      isDayLabel &&
      (field.inputType === 'NUMBER' || field.inputType === 'TEXT')
    ) {
      return (
        <DayInput
          value={value}
          onChange={(v) => setDependsOnStates((p) => ({ ...p, [fieldKey]: v }))}
          onBlur={() => handleFieldBlur(field.id, sectionId, value)}
        />
      );
    }

    // 면적 입력
    if (isAreaLabel) {
      return (
        <AreaInput
          value={value}
          onChange={(v) => setDependsOnStates((p) => ({ ...p, [fieldKey]: v }))}
          onBlur={() => handleFieldBlur(field.id, sectionId, value)}
        />
      );
    }

    // 주소 입력
    if (isAddressLabel) {
      return (
        <AddressInput
          value={value}
          onChange={(v) => {
            setDependsOnStates((p) => ({ ...p, [fieldKey]: v }));
            handleFieldBlur(field.id, sectionId, v);
          }}
        />
      );
    }

    // 시간 입력
    if (isTimeLabel) {
      return (
        <TimeInput
          value={value}
          onChange={(v) =>
            setDependsOnStates((prev) => ({ ...prev, [fieldKey]: v }))
          }
          onBlur={() => handleFieldBlur(field.id, sectionId, value)}
        />
      );
    }

    // 공통 props for text/number/date
    const commonProps = {
      id: fieldKey,
      name: fieldKey,
      required: field.required,
      className: 'w-full p-2 rounded-md border bg-white border-gray-400',
      onBlur: (e: React.FocusEvent<HTMLInputElement>) =>
        handleFieldBlur(field.id, sectionId, e.target.value),
    };

    switch (field.inputType) {
      case 'TEXT':
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

      case 'NUMBER':
        // default numeric input (non-Day)
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

      case 'DATE':
        if (!templateData) return null;
        // DateFieldInput 로직 그대로…
        const section = templateData.sections.find((s) =>
          s.fields.some((f) => f.fieldKey === fieldKey),
        )!;
        const isEnd = field.label.includes('종료');
        const isStart = field.label.includes('시작');
        let minDate: Date | undefined, maxDate: Date | undefined;
        if (isEnd) {
          const start = section.fields.find((f) => f.label.includes('시작'));
          const sv = start && dependsOnStates[start.fieldKey];
          if (sv) minDate = new Date(sv);
        }
        if (isStart) {
          const end = section.fields.find((f) => f.label.includes('종료'));
          const ev = end && dependsOnStates[end.fieldKey];
          if (ev) maxDate = new Date(ev);
        }
        return (
          <DateFieldInput
            value={value}
            onChange={(v) =>
              setDependsOnStates((p) => ({ ...p, [fieldKey]: v }))
            }
            onBlur={() => handleFieldBlur(field.id, sectionId, value)}
            minDate={minDate}
            maxDate={maxDate}
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
            saveMultiCheckbox(field, sectionId, next);
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
                  {selected.includes(opt) && (
                    <div className="pl-4 space-y-2">
                      {templateData!.sections
                        .flatMap((sec) => sec.fields)
                        .filter((f) => f.dependsOn === `${fieldKey}=${opt}`)
                        .map((dep) => (
                          <div key={dep.id}>
                            {dep.label && (
                              <label
                                htmlFor={`inp-${dep.fieldKey}`}
                                className="block font-medium text-sm"
                              >
                                {dep.label}
                              </label>
                            )}
                            {renderInputField(dep, sectionId)}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        }
        // 단일 checkbox
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

  /* 최종 저장 & 미리보기 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractId || !templateData) return;

    // 1) 필수 항목 누락 체크 (기존 로직)
    const missing: string[] = [];
    templateData.sections.forEach((sec) =>
      sec.fields.forEach((f) => {
        if (!f.required || !shouldShowField(f)) return;
        const v = dependsOnStates[f.fieldKey];
        const isEmpty =
          v === undefined ||
          v === '' ||
          (f.inputType === 'CHECKBOX' &&
            parseOptions(f.options).length > 0 &&
            JSON.parse(v).length === 0);
        if (isEmpty) missing.push(f.label);
      }),
    );
    if (missing.length) {
      Swal.fire({
        icon: 'warning',
        title: '필수 항목 누락',
        html: `<ul style="text-align:left;padding-left:1em;">${missing
          .map((m) => `<li>• ${m}</li>`)
          .join('')}</ul>`,
      });
      return;
    }

    // 2) payload 생성
    const payload: ContractInputSection[] = templateData.sections.map(
      (sec) => ({
        sectionId: sec.id,
        fieldValues: sec.fields
          // 멀티 체크박스(f.inputType==='CHECKBOX' && opts.length>0) 제외
          .filter(
            (f) =>
              !(
                f.inputType === 'CHECKBOX' && parseOptions(f.options).length > 0
              ),
          )
          // undefined/'' 값 제외
          .filter((f) => {
            const v = dependsOnStates[f.fieldKey];
            return v !== undefined && v !== '';
          })
          .map((f) => ({
            fieldId: f.id,
            value: String(dependsOnStates[f.fieldKey]),
          })),
      }),
    );

    // console.log('Submit payload (no multi):', payload);

    // 3) 저장 요청
    try {
      const res = await saveContractInputs({ contractId, inputs: payload });
      navigate(`/contract/${contractId}/preview`, {
        state: {
          contractId,
          templateName: templateData.template.name,
          legalClausesBySection: res,
        },
      });
    } catch (err: any) {
      // console.error('Status:', err.response?.status);
      // console.error('Body:', err.response?.data);
      Swal.fire({
        icon: 'error',
        title: '저장 실패',
        text: `${err.response?.data?.error?.code}: ${err.response?.data?.error?.message}`,
      });
    }
  };

  if (!templateData)
    return (
      <div className="flex items-center justify-center min-h-[300px] text-gray-600">
        템플릿을 불러오는 중입니다…
      </div>
    );

  return (
    <div className="container py-16 mx-auto overflow-visible">
      {/* 페이지 제목 */}
      <h1 className="text-4xl font-bold text-center mb-4">
        {templateData.template.name} 작성
      </h1>

      {/* ───── Sticky 툴바 ───── */}
      <WriteStickyBar
        onReset={handleReset}
        isResetting={resetMutation.isPending}
        submitTargetId="writeForm"
      />
      <div className="h-7" />
      {/* 체크리스트 모달 */}
      {showModal && (
        <ChecklistModal
          checklist={checklist}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* 작성 폼 */}
      <form
        id="writeForm"
        onSubmit={handleSubmit}
        className="space-y-10 max-w-3xl mx-auto px-4 sm:px-6"
      >
        {templateData.sections.map((section) => (
          <section
            key={section.id}
            className="p-5 bg-[#F6F6F6] rounded-2xl border border-gray-300"
          >
            {/* 섹션 헤더 */}
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-bold">{section.name}</h2>
              {section.description && (
                <div className="relative">
                  <button
                    type="button"
                    className="text-gray-500 cursor-pointer"
                    onClick={() =>
                      setTooltipField((prev) =>
                        prev === section.id ? null : section.id,
                      )
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

            {/* 필드 목록 */}
            <div className="grid gap-4">
              {section.fields
                .filter((f) => {
                  // 1) 표시 조건
                  if (!shouldShowField(f)) return false;
                  // 2) multi-checkbox 부모에 종속된 필드는 하단에서 제외
                  if (f.dependsOn) {
                    const [parentKey] = f.dependsOn.split(/!=|=/);
                    const pf = section.fields.find(
                      (x) => x.fieldKey === parentKey,
                    );
                    if (pf && isMultiCheckboxField(pf)) {
                      return false;
                    }
                  }
                  return true;
                })
                .map((field) => {
                  const opts = parseOptions(field.options);
                  return (
                    <div
                      key={field.fieldKey}
                      className={
                        field.inputType === 'CHECKBOX' && opts.length > 0
                          ? 'space-y-2'
                          : 'space-y-1'
                      }
                    >
                      {field.inputType === 'CHECKBOX' &&
                        (() => {
                          if (opts.length > 0) {
                            return (
                              <>
                                {/* 그룹 레이블 */}
                                <label
                                  className="font-medium block mb-2"
                                  htmlFor={field.fieldKey}
                                >
                                  {field.label}
                                </label>
                                {opts.map((opt) => {
                                  const inputId = `chk-${field.fieldKey}-${opt}`;
                                  const selected: string[] = dependsOnStates[
                                    field.fieldKey
                                  ]
                                    ? JSON.parse(
                                        dependsOnStates[field.fieldKey],
                                      )
                                    : [];
                                  return (
                                    <div key={opt} className="space-y-2">
                                      <input
                                        type="checkbox"
                                        id={inputId}
                                        className="w-4 h-4"
                                        checked={selected.includes(opt)}
                                        onChange={() => {
                                          const next = selected.includes(opt)
                                            ? selected.filter((v) => v !== opt)
                                            : [...selected, opt];
                                          setDependsOnStates((p) => ({
                                            ...p,
                                            [field.fieldKey]:
                                              JSON.stringify(next),
                                          }));
                                          saveMultiCheckbox(
                                            field,
                                            section.id,
                                            next,
                                          );
                                        }}
                                      />
                                      <label
                                        htmlFor={inputId}
                                        className="ml-2 cursor-pointer select-none"
                                      >
                                        {opt}
                                      </label>

                                      {selected.includes(opt) && (
                                        <div className="pl-6 space-y-2">
                                          {templateData!.sections
                                            .flatMap((sec) => sec.fields)
                                            .filter(
                                              (f) =>
                                                f.dependsOn ===
                                                `${field.fieldKey}=${opt}`,
                                            )
                                            .map((dep) => (
                                              <div key={dep.id}>
                                                {dep.label && (
                                                  <label
                                                    htmlFor={`inp-${dep.fieldKey}`}
                                                    className="block font-medium text-sm"
                                                  >
                                                    {dep.label}
                                                  </label>
                                                )}
                                                {renderInputField(
                                                  dep,
                                                  section.id,
                                                )}
                                              </div>
                                            ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </>
                            );
                          }

                          // 단일 체크박스
                          const inputId = `chk-${field.fieldKey}`;
                          const checked =
                            dependsOnStates[field.fieldKey] === '1';
                          return (
                            <div
                              key={field.fieldKey}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="checkbox"
                                id={inputId}
                                className="w-4 h-4"
                                checked={checked}
                                onChange={() => {
                                  const v = checked ? '0' : '1';
                                  setDependsOnStates((p) => ({
                                    ...p,
                                    [field.fieldKey]: v,
                                  }));
                                  handleFieldBlur(field.id, section.id, v);
                                }}
                              />
                              <label
                                htmlFor={inputId}
                                className="cursor-pointer select-none font-medium"
                              >
                                {field.label}
                              </label>
                            </div>
                          );
                        })()}
                      {field.inputType !== 'CHECKBOX' && (
                        <>
                          <label
                            htmlFor={field.fieldKey}
                            className="font-medium block"
                          >
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

export default WriteFillPage;
