import { Link } from "react-router-dom"

const RentalIntro: React.FC = () => (
  <div className="space-y-4 text-gray-700">
    <p>
      임대차 계약서 자동 작성 페이지입니다.<br/>
      임대인·임차인 정보와 임대 조건을 입력하시면<br/>
      표준 임대차 계약서를 만들어 드립니다.
    </p>
    <ul className="space-y-1 text-gray-600 list-disc list-inside">
      <li>임대 물건 주소 및 면적 입력</li>
      <li>보증금·임대료·임대 기간 지정</li>
      <li>관리·수리 책임사항 등 특약 설정</li>
    </ul>
    <Link
      to="/write/rental/fill"
      className="inline-block px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
    >
      작성 시작하기
    </Link>
  </div>
)

export default RentalIntro
