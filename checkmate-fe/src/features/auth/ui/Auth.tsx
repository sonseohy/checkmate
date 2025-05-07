import { useState, useEffect } from "react";
import { PostKakaoCallback } from "@/features/auth";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();
  const [isProcessed, setIsProcessed] = useState<boolean>(false); // 상태 추가

  useEffect(() => {
    if (isProcessed) {
      navigate("/"); // 상태가 true로 변경되면 리다이렉트
    }
  }, [isProcessed, navigate]); // isProcessed가 변경되면 이 effect가 실행됨

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (!code) return;

    PostKakaoCallback(code)
      .then(res => {
        console.log("[Auth] callback 성공:", res);
        setIsProcessed(true);  // 처리 완료 후 상태 업데이트
      })
      .catch((err) => {
        console.error("카카오 콜백 처리 실패:", err);
      });
  }, [navigate]);  // 상태가 변경되면 다시 실행되지 않도록 의존성 배열에 추가

  return (
    <div className="h-screen flex items-center justify-center">
      <p>로그인 처리 중입니다…</p>
    </div>
  );
}
