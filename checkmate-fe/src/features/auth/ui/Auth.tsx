import { useState, useEffect } from 'react';
import { PostKakaoCallback } from '@/features/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';

export default function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1) 콜백 경로, code 파라미터 체크
    if (location.pathname !== '/login') return;
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (!code) {
      return;
    }

    // 2) 같은 code 처리 방지
    const prev = sessionStorage.getItem('kakaoProcessedCode');
    if (prev === code) {
      navigate('/', { replace: true });
      return;
    }
    // 3) 새 code 이므로 저장
    sessionStorage.setItem('kakaoProcessedCode', code);

    // 4) URL 에서 code 지우기
    window.history.replaceState(null, document.title, location.pathname);

    // 5) 토큰 요청
    PostKakaoCallback(code, dispatch)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['userInfo'] });
        navigate('/', { replace: true });
      })
      .catch(() => {
        setError('카카오 콜백 처리에 실패했습니다.');
      });
  }, [dispatch, location, navigate, queryClient]);

  // 에러 알림
  useEffect(() => {
    if (error) alert(error);
  }, [error]);

  return (
    <div className="h-screen flex items-center justify-center">
      {!error && <p>로그인 처리 중…</p>}
    </div>
  );
}
