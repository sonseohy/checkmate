import { Link, useParams } from "react-router-dom"

type Params = {
  template: string
}


interface CategorySelectorProps {
    mode: "write" | "analyze"
  }

// 템플릿 키 → 한국어로 매핑
const templateLabelMap: Record<string, string> = {
    employment:   "근로 계약서",
    "real-estate":"부동산 매매 계약서",
    rental:       "임대차 계약서",
  }

// 서브타입 리스트를 템플릿별로 맵핑
const subtypeMap: Record<string, { key: string; label: string }[]> = {
  // 근로 계약서 서브타입 (아래는 임시로 저렇게 해둠)
  employment: [
    { key: "40hr",        label: "근로계약서(주40시간 근무)" },
    { key: "flex-5plus",  label: "근로계약서(유연근무, 5인 이상)" },
    { key: "flex-5minus", label: "근로계약서(유연근무, 5인 미만)" },
    { key: "hospital-5plus", label: "근로계약서(병원용, 5인 이상)" },
  ],
  'real-estate': [
    { key: "40hr",        label: "부동산 매매계약서(주40시간 근무)" },
    { key: "flex-5plus",  label: "부동산 매매계약서(유연근무, 5인 이상)" },
    { key: "flex-5minus", label: "부동산 매매계약서(유연근무, 5인 미만)" },
    { key: "hospital-5plus", label: "부동산 매매계약서(병원용, 5인 이상)" },
  ],
  rental: [
    { key: "40hr",        label: "임대차 계약서(주40시간 근무)" },
    { key: "flex-5plus",  label: "임대차 계약서(유연근무, 5인 이상)" },
    { key: "flex-5minus", label: "임대차 계약서(유연근무, 5인 미만)" },
    { key: "hospital-5plus", label: "임대차 계약서(병원용, 5인 이상)" },
  ],
}

interface CategorySelectorProps {
  /** "write(작성)" 또는 "analyze(분석)" */
  mode: "write" | "analyze"
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ mode }) => {
  const { template } = useParams<Params>()
  const options = subtypeMap[template!] || []
  const mainLabel = templateLabelMap[template!] || template

  return (
    <div className="container py-16 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-center">
        어떤 {mainLabel}을 {mode === "write" ? "작성하시겠습니까?" : "분석하시겠습니까?"}
      </h1>
      <ul className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 md:grid-cols-3">
        {options.map((opt) => {
          // write 모드면 intro, analyze 모드면 upload 경로로 연결
          const toPath =
            mode === "write"
              ? `/${mode}/${template}/${opt.key}`
              : `/${mode}/${template}/${opt.key}/upload`

          return (
            <li key={opt.key}>
              <Link
                to={toPath}
                className="block p-6 text-center bg-white border rounded-lg hover:shadow-md"
              >
                {opt.label}
              </Link>
            </li>
          )
        })}
      </ul>

    </div>
  )
}

export default CategorySelector
