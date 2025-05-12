import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getContractQuestions, questionList } from "@/features/detail";

const ContractDetail:React.FC = () => {
    const location = useLocation();
    const contract = location.state;
    const [questions, setQuestions] = useState<questionList>({ question: [] });

    useEffect(() => {
    // API 호출하여 질문 리스트 가져오기
    const fetchQuestions = async () => {
      try {
        const data = await getContractQuestions(contract.contract_id);  // contractId로 질문 리스트 불러오기
        console.log(data)
        setQuestions(data);  // 상태 업데이트
      } catch (error) {
        console.error("질문 리스트 불러오기 실패:", error);
      }
    };

    if (contract?.contract_id) {
      fetchQuestions(); // contract_id가 있는 경우에만 API 호출
    }
  }, [contract.contract_id]);  

  

    return (
        <div>
            <div className="my-5">
                <p>계약서명 : {contract.title}</p>
                 <p>계약 ID: {contract.contract_id}</p>
                <p className="text-gray-500 text-sm mt-1">작성 날짜: {new Date(contract.updated_at).toLocaleDateString()}</p>

            </div>
            <div className="h-px bg-gray-200 " />
            <div className="mt-3">
                <div>질문 리스트</div>
                {questions?.question?.length === 0 ? (
                    <div>질문 리스트가 존재하지 않습니다.</div>
                    ) : (
                    questions?.question?.map((question) => (
                        <li key={question.questionId}>{question.questionDetail}</li>
                    ))
                )}
            </div>
        </div>
    );
};
export default ContractDetail;