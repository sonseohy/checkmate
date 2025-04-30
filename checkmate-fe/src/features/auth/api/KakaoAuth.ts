
import { customAxios } from "@/shared/api/client/customAxios";

export function PostKakaoCallback(code: string) {
    return customAxios.post("/api/auth/kakao/callback", { code });
  }