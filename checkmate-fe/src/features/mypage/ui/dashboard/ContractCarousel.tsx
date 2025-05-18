import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./slick-slider.css";
import { Contract } from "@/features/mypage";
import { useNavigate } from "react-router-dom";
import { useMobile } from "@/shared";


interface ContractCarouselProps {
  contractList: Contract[];
};

const ContractCarousel: React.FC<ContractCarouselProps> = ({ contractList }) => {
  const navigate = useNavigate();
  const isMobile = useMobile();

  //계약서 상세조회 api 호출 및 페이지 이동
  const handleContractDetail = async(contractId:number, contract:Contract ) => {
    if (contract.edit_status === 'COMPLETED') {
       navigate(`/detail/${contractId}`,{ state: contract });
    } else {
      navigate(`/write/edit/${contractId}`,{ state: contract });
    }
  };

  const slidesToShow = Math.min(contractList.length, 2);

  const setting = {
    dots:false,
    infinite: false,
    centerMode: false, 
    speed: 500,
    vertical: false,
     variableWidth: true, 
    slidesToShow: slidesToShow,
    slidesToScroll:1,
  };

  return (
    <div className={` overflow-x-hidden ${isMobile? 'h-full':' w-full '}`}>
      <Slider {...setting}> 
        {contractList.map((contract) => (
           <div key={contract.contract_id} onClick={() => handleContractDetail(contract.contract_id, contract )}>
            <div className={`bg-white rounded-2xl shadow ${isMobile ? 'p-4 mr-3 w-[200px] h-[200px]':' p-5 w-[250px] h-[180px]'}`} >
              <div className="flex justify-between items-center">
                <span className={`inline-block rounded-md px-3 py-1 text-sm font-medium text-white ${
                  contract.source_type === 'USER_UPLOAD' 
                  ? 'bg-[#B4C7FF]' 
                  : 'bg-[#FFB4B5]'
                  }`
                }>
                  {contract.source_type === 'USER_UPLOAD' ? '분석' : '작성'}
                </span>
                <span className={`ml-3 text-md font-medium ${contract.edit_status === 'COMPLETED' 
                  ? 'text-[#202020]' 
                  : 'text-[#999999]'}`}>
                  {contract.edit_status === 'COMPLETED' ? '작성 완료': '작성중'}
                </span>
              </div>
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