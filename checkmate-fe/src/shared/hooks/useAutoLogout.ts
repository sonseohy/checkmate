import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '@/features/auth';
import Swal from 'sweetalert2';

export const useAutoLogout = (mainRef: React.RefObject<HTMLElement | null>) => {
  const dispatch = useDispatch();
  const idleTimer = useRef<number>(0);
  const expiryTimer = useRef<number>(0);

  const doLogout = useCallback(() => {
    dispatch(logout());
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires_at');
    Swal.fire({
      icon: 'info',
      title: '자동 로그아웃',
      text: '오랜 시간 활동이 없어 자동으로 로그아웃 되었습니다.',
    });
  }, [dispatch]);

  //  유휴 시간 타이머 초기화
  const resetIdle = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(doLogout, 1 * 60 * 1000);
  }, [doLogout]);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    const handleScroll = () => {
      resetIdle();
    };

    const activityEvents = [
      'mousedown',
      'mousemove',
      'keydown',
      'touchstart',
      'scroll',
    ];
    activityEvents.forEach((e) => window.addEventListener(e, resetIdle));
    el.addEventListener('scroll', handleScroll);
    resetIdle();

    return () => {
      activityEvents.forEach((e) => window.removeEventListener(e, resetIdle));
      el.removeEventListener('scroll', handleScroll);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [resetIdle, mainRef]);

  //  토큰 만료 타이머 설정
  useEffect(() => {
    const raw = localStorage.getItem('token_expires_at');
    const accessToken = localStorage.getItem('access_token');
    if (!raw || !accessToken) return;

    const expiresAt = Number(raw);
    const delay = expiresAt - Date.now();

    if (delay <= 0) {
      doLogout();
    } else {
      expiryTimer.current = window.setTimeout(doLogout, delay);
    }

    return () => {
      if (expiryTimer.current) clearTimeout(expiryTimer.current);
    };
  }, [doLogout]);
};
