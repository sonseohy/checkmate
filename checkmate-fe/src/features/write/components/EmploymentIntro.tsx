// src/features/write/components/EmploymentIntro.tsx
import { Link } from "react-router-dom"

const EmploymentIntro: React.FC = () => (
  <div className="space-y-4 text-gray-700">
    <p>
      근로 계약서 자동 작성 페이지입니다.<br/>
      근로자·사용자 정보와 근로 조건, 급여 조건을 입력하시면<br/>
      표준 근로 계약서를 즉시 생성해 드립니다.
    </p>
    <ul className="space-y-1 text-gray-600 list-disc list-inside">
      <li>근로자 인적 사항 입력</li>
      <li>근무 기간 및 시간 설정</li>
      <li>급여 및 복리후생 조건 기재</li>
    </ul>
    <Link
      to="/write/employment/fill"
      className="inline-block px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
    >
      작성 시작하기
    </Link>
  </div>
)

export default EmploymentIntro
