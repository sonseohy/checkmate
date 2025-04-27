import { Link } from "react-router-dom"

const RealEstateIntro: React.FC = () => (
  <div className="space-y-4 text-gray-700">
    <p>
      부동산 매매 계약서 자동 작성 페이지입니다.<br/>
      거래 대상 물건 정보, 매도인·매수인 정보를 입력하시면<br/>
      표준 양식에 맞춰 계약서를 빠르게 완성할 수 있습니다.
    </p>
    <ul className="space-y-1 text-gray-600 list-disc list-inside">
      <li>물건 주소 및 면적 입력</li>
      <li>매매 대금 및 지급 조건 설정</li>
      <li>특약 사항 추가</li>
    </ul>
    <Link
      to="/write/real-estate/fill"
      className="inline-block px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
    >
      작성 시작하기
    </Link>
  </div>
)

export default RealEstateIntro
