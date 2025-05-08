import { useEffect, useState } from "react";
import { UserInfo } from "../model/types";
import { getUserInfo } from "@/entities/user";

export function useUserInfo(): UserInfo | null {
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const me = await getUserInfo();
        if (isMounted) {
          setUser(me);
        }
      } catch (error) {
        console.error(error);
      }
    })();           

    // 언마운트 시 flag 해제
    return () => {
      isMounted = false;
    };
  }, []);  // ← 빈 배열로 마운트 한 번만 실행

  return user;  
}
