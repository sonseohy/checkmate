import { useState, useEffect } from "react";
import { PostKakaoCallback } from "@/features/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'; 

export default function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProcessed, setIsProcessed] = useState<boolean>(false); 
  const [error, setError] = useState<string | null>(null); // 오류 처리 추가

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (window.location.pathname !== '/login') return;
    
    if (!code || isProcessed) {
      navigate("/", { replace: true });
      return;
    }


    setIsProcessed(true);

    const processCallback = async () => {
      try {
        const res = await PostKakaoCallback(code, dispatch);
        if (res) {
          navigate("/"); // 리다이렉트
        } else {
          setError("카카오 콜백 처리에 실패했습니다.");
        }
      } catch (err) {
        setError("카카오 콜백 처리 중 오류가 발생했습니다.");
        console.error(err);
      } finally {
        setIsProcessed(false);  // 호출이 끝나면 isProcessed를 false로 돌려놓기
      }
    };

    processCallback();
  }, [navigate, isProcessed, dispatch]); // isProcessed, navigate 상태에 따라 한 번만 호출되도록 의존성 관리

  useEffect(() => {
    if (error) {
      alert(error); // 오류 발생 시 alert로 표시
    }
  }, [error]);

  return (
    <div className="h-screen flex items-center justify-center">
     
    </div>
  );
}
