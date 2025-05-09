import { useUserInfo } from "@/features/auth";
import { useState } from "react";
import UserInfoModal from "./UserInfoModal";
import Swal from "sweetalert2";
import { deleteUserInfo } from "@/entities/user";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout } from '@/features/auth/slices/authSlice';

//회원 정보
export default function UserInfo() {
    const user = useUserInfo();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [ modalIsOpen, setModalIsOpen ] = useState<boolean>(false);

    //회원 정보 수정 모달
    const showModal = () => {
        setModalIsOpen(!modalIsOpen)
    };

    const handleDeleteAccount = async () => {
        const confirm = await Swal.fire({
            title: '정말로 회원 탈퇴를 하시겠습니까?',
            text: '탈퇴 후에는 모든 정보가 삭제됩니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '예, 탈퇴합니다.',
            cancelButtonText: '취소'
        });

        if (confirm.isConfirmed) {

            const success = await deleteUserInfo();
            if(success) {
                dispatch(logout());
                navigate("/")
            };
        }
    };

    return (
        <div>
             <div className="text-3xl font-bold">
                회원 정보  
            </div>
            <div className="mt-5 p-10 w-200 bg-white rounded-xl shadow-[0px_5px_15px_rgba(0,_0,_0,_0.1)]">
                <div className="flex flex-row gap-15 mb-3">
                    <div className="text-xl font-semibold">
                        로그인 정보
                    </div>
                    <div>
                      {user?.email}
                    </div>
                </div>
                <div className="flex flex-row gap-20 mb-3">
                    <div className="text-xl font-semibold">
                        기본 정보
                    </div>
                    <div>
                        <div className="flex flex-row gap-11 mb-4">
                            <span className="text-lg font-medium">
                                이름 
                            </span>
                            <div className="border-[#9F9F9F] border-1 rounded-md w-60 pl-2 ">
                                <span className="my-2 text-lg">
                                    {user?.name}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-row gap-3 mb-4">
                            <span className="text-lg font-medium">
                                생년월일 
                            </span>
                            <div className="border-[#9F9F9F] border-1 rounded-md w-60 pl-2 ">
                                <span className="my-2 text-lg">
                                    {user?.birth}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-row gap-3 mb-4">
                            <span className="text-lg font-medium">
                                전화번호
                            </span>
                            <div className="border-[#9F9F9F] border-1 rounded-md w-60 pl-2 ">
                                <span className="my-2 text-lg">
                                    {user?.phone}
                                </span>
                            </div>
                        </div>
                        <div>
                            <button 
                                className="ml-20 hover:text-[#3B82F6]"
                                onClick={showModal}
                            >
                                회원 정보 수정
                            </button> | 
                            <button 
                                className="ml-1"
                                onClick={handleDeleteAccount}
                            >
                                회원 탈퇴
                            </button>  
                        </div>
                    </div>
                </div>
            </div>
            {modalIsOpen && <UserInfoModal onClose={showModal}/>}
        </div>
    );
};
