import { Link } from 'react-router-dom';

const ContractWriteIntro: React.FC = () => (
  <div className="space-y-4 text-gray-700">
    <p>
      계약서 자동 작성 페이지입니다.<br/>
      계약 정보, 당사자 정보, 조건을 입력하시면<br/>
      표준 양식에 맞춰 계약서를 완성할 수 있습니다.
    </p>
    <ul className="space-y-1 text-gray-600 list-disc list-inside">
      <li>계약 당사자 정보 입력</li>
      <li>계약 기간 및 조건 설정</li>
      <li>특약 사항 추가 가능</li>
    </ul>
    <Link
      to="/write/contract/12"
      className="inline-block px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
    >
      작성 시작하기
    </Link>
  </div>
);

export default ContractWriteIntro;
