import { updateUserInfo } from "@/entities/user/api/UserApi";
import { useUserInfo } from "@/features/auth";
import { ModalContent } from "@/shared";
import { useState } from "react";
import Swal from "sweetalert2";

interface UserInfoModalProps {
    onClose: () => void;
}

const UserInfoModal:React.FC<UserInfoModalProps> = ({ onClose }) => {
    const user = useUserInfo();
    // 상태 관리 ( 생년월일 , 전화번호 )
    const [birth, setBirth] = useState<string>(user?.birth || "");
    const [phone, setPhone] = useState<string>(user?.phone || "");

    const handleBirthChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setBirth(e.target.value);
    };

    const handlePhoneChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
    };

    const handleSubmit = () => {
        if(birth === "") {
            Swal.fire({
                title: "입력 오류",
                text: "생년월일을 입력해 주세요",
                icon: "warning",
                confirmButtonText: "확인", 
            });
            return;
        }
        const phoneRegex = /^010\d{8,9}$/;
        if (!phoneRegex.test(phone)) {
            Swal.fire({
                title: "입력 오류",
                text: "전화번호를 정확히 입력해 주세요 (예: 01012341234)",
                icon: "warning",
                confirmButtonText: "확인", 
            });
            return;
        }

        const params = { birth, phone };

        updateUserInfo(params,  onClose)
    };


    return (
        <ModalContent isOpen={true} onClose={onClose}>
            <div>
                <div className="text-xl font-bold">
                    회원 정보 수정
                </div>
                <div className="flex flex-row gap-12 mb-3 items-center">
                    <div className="font-medium">
                        이름
                    </div>
                    <div className="border-[#9F9F9F] border-1 rounded-md w-62 pl-2 py-1 ">
                        <span className="">
                            {user?.name}
                        </span>
                    </div>
                </div>
                <div className="flex flex-row gap-5 mb-3 items-center">
                    <div className="font-medium">
                        전화번호
                    </div>
                    <div className="border-[#9F9F9F] border-1 rounded-md w-62 pl-2  py-1">
                        <input 
                            type="text"
                            value={phone}
                            onChange={handlePhoneChange}
                            placeholder="전화번호 입력(예: 01012341234)"
                            className="w-full"
                            />
                    </div>
                </div>
                <div className="flex flex-row gap-5 mb-3  items-center">
                    <div className="font-medium">
                        생년월일
                    </div>
                    <div className="border-[#9F9F9F] border-1 rounded-md w-62 pl-2  py-1">
                        <input 
                            type="date" 
                            value={birth}
                            onChange={handleBirthChange}
                        />
                    </div>
                </div>
                <button 
                    onClick={handleSubmit}
                    className="border-1 border-[#9F9F9F] rounded-md px-4 py-1 hover:bg-[#3B82F6]"
                >수정</button>

            </div>
        </ModalContent>
       
    );
};
export default UserInfoModal;