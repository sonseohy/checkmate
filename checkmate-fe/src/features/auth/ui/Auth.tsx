// 카카오 로그인 콜백 처리 UI
import { useEffect } from "react";
import { PostKakaoCallback } from "@/features/auth";

export default function Auth() {
    useEffect(() => {
      const code = new URL(window.location.href).searchParams.get("code");
      console.log("[Auth] code:", code);
      if (!code) return;
  
      PostKakaoCallback(code)
        .then(res => {
          console.log("[Auth] callback 성공:", res);
          window.location.replace("/");
        })
        .catch((err) => {
          console.error("카카오 콜백 처리 실패:", err);
        });
    }, []);
  
    return (
      <div className="h-screen flex items-center justify-center">
        <p>로그인 처리 중입니다…</p>
      </div>
    );
  }