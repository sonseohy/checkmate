import { useParams } from "react-router-dom"

type Params = {
  template: "real-estate" | "employment" | "rental"
  subtype:  string
}

const FillPage: React.FC = () => {
  const { template, subtype } = useParams<Params>()

  return (
    <div className="container py-16 mx-auto space-y-6">
      <h1 className="text-2xl font-bold">
        {template === "employment"
          ? `근로계약서 작성 (${subtype})`
          : template === "real-estate"
          ? `부동산매매 계약서 작성 (${subtype})`
          : `임대차 계약서 작성 (${subtype})`}
      </h1>

      {/* TODO: 여기에 실제 각 템플릿·서브타입별 입력 폼을 구현하세요 */}
      <p className="text-gray-600">
        여기서 계약서 내용을 입력하고, 저장/내보내기 기능을 넣습니다.
      </p>
    </div>
  )
}

export default FillPage