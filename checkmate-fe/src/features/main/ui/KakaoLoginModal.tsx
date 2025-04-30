import { ModalContent } from "@/shared";
import kakaoBtn from "@assets/KakaoBtn.png";
import { useState, useEffect } from "react";


interface KakaoLoginModalProps {
  onClose: () => void;
}

const REST_API = import.meta.env.VITE_REST_API;
const redirectUri = import.meta.env.VITE_REDIRECT_URL;
const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API}&redirect_uri=${redirectUri}&response_type=code`;

export default function KakaoLoginModal({ onClose }: KakaoLoginModalProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);



  const handleKakaoLogin = () => {
    console.log("🟢 카카오 로그인 버튼 클릭, 리다이렉트 URL:", kakaoURL);
    window.location.href = kakaoURL;
  };

  // useEffect로 카카오 로그인 이미지가 로드되었을 때 상태 업데이트
  useEffect(() => {
    const img = new Image();
    img.src = kakaoBtn; 
    img.onload = () => {
      setIsImageLoaded(true); // 이미지가 로드되면 상태를 true로 변경
    };
  }, []); 

  return (
    <ModalContent isOpen={true} onClose={onClose}>
      {isImageLoaded && (
        <div className="flex flex-col justify-center items-center">
          <img src="/icons/favicon-96x96.png" alt="logo" className="w-23 h-23" />
          <div className="flex flex-row mt-7">
            <span className="text-2xl font-bold">빠르고, 쉽게</span>
            <span className="ml-2 text-2xl font-bold text-[#60A5FA]">checkmate</span>
          </div>
          <button 
            onClick={handleKakaoLogin}
            className="mt-20 rounded-md font-semibold">
            <img
              src={kakaoBtn}
              alt="카카오 로그인"
              className="w-[320px] h-auto"
            />
          </button>
        </div>
      )}
    </ModalContent>
  );
}
