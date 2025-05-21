import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchExistingContract,
  saveContractInputs,
  useResetContractInputs,
  TemplateField,
  TemplateSection,
  ContractInputSection,
  parseOptions,
} from '@/features/write';
import { WriteStickyBar } from '@/widgets/write';
import { LuTag } from 'react-icons/lu';
import Swal from 'sweetalert2';
import {
  ResidentIdInput,
  PhoneNumberInput,
  MoneyInput,
  DayInput,
  AreaInput,
  AddressInput,
  DateFieldInput,
} from '@/shared';

// multi-checkbox helper
const isMultiCheckboxField = (field: TemplateField) =>
  field.inputType === 'CHECKBOX' && parseOptions(field.options).length > 0;

const WriteEditPage: React.FC = () => {
  const { contractId } = useParams();
  const numericContractId = Number(contractId);
  const navigate = useNavigate();

  const [templateData, setTemplateData] = useState<{
    contract: any;
    template: any;
    sections: TemplateSection[];
  } | null>(null);
  const [dependsOnStates, setDependsOnStates] = useState<Record<string, any>>(
    {},
  );
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

  const saveMultiCheckbox = async (
    field: TemplateField,
    sectionId: number,
    selected: string[],
  ) => {
    if (!contractId) return;
    // 선택된 옵션마다 fieldValues 항목을 하나씩 생성
    const fieldValues = selected.map((opt) => ({
      fieldId: field.id,
      value: opt,
    }));
    try {
      await saveContractInputs({
        contractId: numericContractId,
        inputs: [{ sectionId, fieldValues }],
      });
    } catch (e: any) {
      // console.error('멀티체크박스 저장 실패:', e.response?.data || e);
    }
  };

  /* blur 자동 저장 */
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
        contractId: numericContractId,
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
    const raw = dependsOnStates[fieldKey] ?? '';
    const value = String(raw);

    // helper: 레이블에 키워드 포함 여부
    const includesAny = (label: string, keywords: string[]) =>
      keywords.some((k) => label.includes(k));

    // maxLength 계산
    const getMaxLength = (label: string): number => {
      if (includesAny(label, ['전화번호', '연락처'])) return 13;
      if (includesAny(label, ['주민등록번호'])) return 13;
      if (includesAny(label, ['이름', '성명'])) return 50;
      if (includesAny(label, ['주소'])) return 100;
      return 100;
    };

    const isResidentId = includesAny(field.label, ['주민등록번호']);
    const isPhone = includesAny(field.label, ['전화번호', '연락처']);
    const isDayLabel = includesAny(field.label, ['지불일', '지급시기']);
    const isArea = field.label.trim().endsWith('면적');
    const isAddress =
      includesAny(field.label, ['주소', '소재지']) &&
      !field.label.includes('상세');

    // 주민등록번호
    if (isResidentId) {
      return (
        <ResidentIdInput
          value={value}
          onChange={(v) => setDependsOnStates((p) => ({ ...p, [fieldKey]: v }))}
          onComplete={(v) => handleFieldBlur(field.id, sectionId, v)}
        />
      );
    }
    // 전화번호
    if (isPhone) {
      return (
        <PhoneNumberInput
          value={value}
          onChange={(v) => setDependsOnStates((p) => ({ ...p, [fieldKey]: v }))}
          onBlur={() => handleFieldBlur(field.id, sectionId, value)}
        />
      );
    }
    // 금액
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

    // 날짜 중 “일” 입력
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
    // 면적
    if (isArea) {
      return (
        <AreaInput
          value={value}
          onChange={(v) => setDependsOnStates((p) => ({ ...p, [fieldKey]: v }))}
          onBlur={() => handleFieldBlur(field.id, sectionId, value)}
        />
      );
    }
    // 주소
    if (isAddress) {
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

    // 공통 props
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

      case 'DATE': {
        if (!templateData) return null;
        const section = templateData.sections.find((s) =>
          s.fields.some((f) => f.fieldKey === fieldKey),
        )!;
        const isEnd = field.label.includes('종료');
        const isStart = field.label.includes('시작');
        let minDate: Date | undefined, maxDate: Date | undefined;
        if (isEnd) {
          const sf = section.fields.find((f) => f.label.includes('시작'));
          const sv = sf && dependsOnStates[sf.fieldKey];
          if (sv) minDate = new Date(sv);
        }
        if (isStart) {
          const ef = section.fields.find((f) => f.label.includes('종료'));
          const ev = ef && dependsOnStates[ef.fieldKey];
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
      }

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
          let selected: string[];
          try {
            selected = Array.isArray(raw)
              ? raw
              : raw.startsWith('[')
              ? JSON.parse(raw)
              : raw
              ? [raw]
              : [];
          } catch {
            selected = [];
          }
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
          const dependentFields = (opt: string) =>
            templateData!.sections
              .flatMap((sec) => sec.fields)
              .filter((f) => f.dependsOn === `${fieldKey}=${opt}`);
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
                      {dependentFields(opt).map((dep) => (
                        <div key={dep.id}>
                          {dep.label && (
                            <label
                              htmlFor={dep.fieldKey}
                              className="block font-medium"
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
      showCancelButton: true,
    }).then((r) => r.isConfirmed);
    if (!ok) return;
    try {
      const res = await resetMutation.mutateAsync(numericContractId);
      setDependsOnStates({});
      Swal.fire('완료', res.message, 'success');
    } catch {
      Swal.fire('실패', '초기화에 실패했습니다.', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numericContractId || !templateData) return;

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
      const res = await saveContractInputs({
        contractId: numericContractId,
        inputs: payload,
      });
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

      <form
        id="writeForm"
        className="space-y-10 max-w-3xl mx-auto px-4 sm:px-6"
        onSubmit={handleSubmit}
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
                                  const raw =
                                    dependsOnStates[field.fieldKey] ?? '';
                                  const inputId = `chk-${field.fieldKey}-${opt}`;
                                  // 안전하게 다중값 파싱
                                  let selected: string[];
                                  try {
                                    if (Array.isArray(raw)) {
                                      selected = raw;
                                    } else if (
                                      typeof raw === 'string' &&
                                      raw.trim().startsWith('[')
                                    ) {
                                      selected = JSON.parse(raw);
                                    } else if (
                                      typeof raw === 'string' &&
                                      raw !== ''
                                    ) {
                                      selected = [raw];
                                    } else {
                                      selected = [];
                                    }
                                  } catch {
                                    selected = [];
                                  }
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

export default WriteEditPage;
