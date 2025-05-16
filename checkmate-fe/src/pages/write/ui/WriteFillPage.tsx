import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { MidCategory, SubCategory } from '@/features/categories';
import { useChecklist, ChecklistModal, useCreateContractTemplate, TemplateField, ContractInputSection, saveContractInputs, CreateContractTemplateResponse, useResetContractInputs, parseOptions } from '@/features/write';
import { getUserInfo } from '@/entities/user';
import { WriteStickyBar } from '@/widgets/write';
import { LuTag } from 'react-icons/lu';
import Swal from 'sweetalert2';

const WriteFillPage: React.FC = () => {
  /* 라우팅 & 기본 준비 */
  const { categoryId }   = useParams();
  const numericCategoryId = Number(categoryId);
  const navigate          = useNavigate();

  const { state } = useLocation() as {
    state?: { selectedMid?: MidCategory; selectedSub?: SubCategory; isNew?: boolean };
  };
  /* 체크리스트 */
  const midCategoryId          = state?.selectedMid?.id;
  const { data: checklist = [] } = useChecklist(midCategoryId);

 /* 로컬 상태 */
  const [showModal, setShowModal]           = useState(state?.isNew ?? true);
  const [tooltipField, setTooltipField]     = useState<number | null>(null);
  const [dependsOnStates, setDependsOnStates] = useState<Record<string, any>>({});
  const [contractId, setContractId]         = useState<number | null>(null);
  const [templateData, setTemplateData]     = useState<CreateContractTemplateResponse | null>(null);

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
            contract : res.contract,
            template : res.template,
            sections : res.sections,
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
  const handleFieldBlur = async (fieldId: number, sectionId: number, value: string) => {
    if (!contractId) return;
    try {
      await saveContractInputs({
        contractId,
        inputs: [{ sectionId, fieldValues: [{ fieldId, value }] }],
      });
    } catch (err) {
      console.error('자동 저장 실패:', err);
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
    // mutateAsync는 프로미스 형태로 결과(data) 반환
    const res = await resetMutation.mutateAsync(contractId);
    setDependsOnStates({});                 // 상태 비우기
    Swal.fire('완료', res.message ?? '초기화되었습니다.', 'success');
  } catch (err: any) {
    const msg =
      err?.response?.data?.error?.message ??
      '초기화에 실패했습니다. 다시 시도해 주세요.';
    Swal.fire('실패', msg, 'error');
  }
};

  /* 렌더링 보조 */
  const shouldShowField = (field: TemplateField) => {
    if (!field.dependsOn) return true;
    if (field.dependsOn.includes('!=')) {
      const [key, notExp] = field.dependsOn.split('!=');
      return dependsOnStates[key] !== notExp;
    }
    const [key, exp] = field.dependsOn.split('=');
    return dependsOnStates[key] === exp;
  };

  const renderInputField = (field: TemplateField, sectionId: number) => {
    const commonProps = {
      id: field.fieldKey,
      name: field.fieldKey,
      required: field.required,
      className: 'w-full p-2 rounded-md border bg-white border-gray-400',
      onBlur: (e: React.FocusEvent<HTMLInputElement>) =>
        handleFieldBlur(field.id, sectionId, e.target.value),
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
              setDependsOnStates((p) => ({ ...p, [field.fieldKey]: e.target.value }))
            }
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
                  name={field.fieldKey}
                  value={opt}
                  checked={dependsOnStates[field.fieldKey] === opt}
                  onChange={() => {
                    setDependsOnStates((p) => ({ ...p, [field.fieldKey]: opt }));
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

      /* ───────── 체크박스 ───────── */
      case 'CHECKBOX': {
        const opts = parseOptions(field.options);

        /* ① 다중 선택(check list) */
        if (opts.length) {
          const selected: string[] = dependsOnStates[field.fieldKey]
            ? JSON.parse(dependsOnStates[field.fieldKey])
            : [];

          const toggle = (item: string) => {
            const next = selected.includes(item)
              ? selected.filter((v) => v !== item)
              : [...selected, item];

            setDependsOnStates((p) => ({
              ...p,
              [field.fieldKey]: JSON.stringify(next),
            }));
            handleFieldBlur(field.id, sectionId, JSON.stringify(next));
          };

          return (
            <div className="space-y-2">
              {opts.map((opt) => (
                <label key={opt} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(opt)}
                    onChange={() => toggle(opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          );
        }

        /* ② 단일 Boolean 체크박스 */
        return (
          <input
            type="checkbox"
            {...commonProps}
            className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            checked={dependsOnStates[field.fieldKey] === '1'}
            onChange={() => {
              const v = dependsOnStates[field.fieldKey] === '1' ? '0' : '1';
              setDependsOnStates((p) => ({ ...p, [field.fieldKey]: v }));
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
    const missing: string[] = [];

    templateData?.sections.forEach((sec) =>
      sec.fields.forEach((f) => {
        // 1) 화면에 보이는 + required 필드만 검사
        if (!f.required || !shouldShowField(f)) return;

        const v = dependsOnStates[f.fieldKey];

        /* 2) 타입별 누락 판정 - 여기서 보완 */
        const isEmpty =
          v === undefined ||                          // 입력 안함
          v === '' ||                                // 텍스트/넘버 등이 빈값
          (f.inputType === 'CHECKBOX' &&
            parseOptions(f.options).length &&        // 다중 체크박스
            JSON.parse(v ?? '[]').length === 0);     // 선택 항목이 0개

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

    if (!contractId || !templateData) return;
    const payload: ContractInputSection[] = templateData.sections.map((sec) => ({
      sectionId: sec.id,
      fieldValues: sec.fields
        .filter((f) => f.fieldKey in dependsOnStates)
        .map((f) => ({ fieldId: f.id, value: String(dependsOnStates[f.fieldKey]) })),
    }));

    try {
      const res = await saveContractInputs({ contractId, inputs: payload });
      navigate(`/contract/${contractId}/preview`, {
        state: { contractId, templateName: templateData.template.name, legalClausesBySection: res },
      });
    } catch {
      Swal.fire({ icon: 'error', title: '저장 실패', text: '다시 시도해 주세요.' });
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
      {showModal && <ChecklistModal checklist={checklist} onClose={() => setShowModal(false)} />}

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
                <>
                  <button
                    type="button"
                    className="text-gray-500"
                    onClick={() =>
                      setTooltipField((p) => (p === section.id ? null : section.id))
                    }
                  >
                    <LuTag className="w-4 h-4" />
                  </button>
                  {tooltipField === section.id && (
                    <div className="ml-2 px-3 py-2 text-sm bg-white border rounded shadow">
                      {section.description}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* 필드 목록 */}
            <div className="grid gap-4">
              {section.fields.filter(shouldShowField).map((field) => (
                <div
                  key={field.fieldKey}
                  className={
                    field.inputType === 'CHECKBOX' ? 'flex items-center' : 'space-y-1'
                  }
                >
                  <label
                    htmlFor={field.fieldKey}
                    className={`${
                      field.inputType === 'CHECKBOX' ? 'order-2' : 'block'
                    } font-medium`}
                  >
                    {field.label}
                  </label>
                  {field.inputType === 'CHECKBOX' ? (
                    <div className="order-1 mr-1">
                      {renderInputField(field, section.id)}
                    </div>
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

export default WriteFillPage;