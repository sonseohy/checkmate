import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./slick-slider.css";
import { Contract } from "@/features/mypage";
import { useNavigate } from "react-router-dom";


interface ContractCarouselProps {
  contractList: Contract[];
}

const ContractCarousel: React.FC<ContractCarouselProps> = ({ contractList }) => {
  const navigate = useNavigate();

  //계약서 상세조회 api 호출 및 페이지 이동
  const handleContractDetail = async(contractId:number, contract:Contract ) => {
    navigate(`/detail/${contractId}`,{ state: contract });
  };

  console.log(contractList)

  const setting = {
    dots: true,
    infinite: true,
    speed: 500,
    vertical: false,
    slidesToShow:5,
    slidesToScroll:1,
  };

  return (
    <div className=" overflow-x-hidden  max-w-[1150px] h-[400px]">
      <Slider {...setting}> 
        {contractList.map((contract) => (
           <div key={contract.contract_id} onClick={() => handleContractDetail(contract.contract_id, contract )}>
            <div className="bg-white rounded-2xl shadow p-5 w-[300px] h-[200px]" >
              <span className={`inline-block rounded-md px-3 py-1 text-sm font-medium text-white ${
                contract.source_type === 'USER_UPLOAD' ? 'bg-[#B4C7FF]' : 'bg-[#FFB4B5]'
              }`}>
                {contract.source_type === 'USER_UPLOAD' ? '분석' : '작성'}
              </span>
              <h3 className="mt-3 text-lg font-semibold">{contract.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{new Date(contract.updated_at).toLocaleDateString()}</p>
            </div>
         </div>
        ))}

      </Slider>
    </div>
  );
};
export default ContractCarousel;