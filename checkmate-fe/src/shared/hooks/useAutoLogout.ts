import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '@/features/auth';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export const useAutoLogout = (mainRef: React.RefObject<HTMLElement | null>) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const idleTimer = useRef<number>(0);

  // 로그아웃 수행 함수
  const doLogout = useCallback(() => {
    dispatch(logout());
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    Swal.fire({
      icon: 'info',
      title: '자동 로그아웃',
      text: '오랜 시간 활동이 없어 자동으로 로그아웃 되었습니다.',
      confirmButtonText: '확인',
    }).then(() => {
      navigate('/');
    });
  }, [dispatch, navigate]);

  // 유휴 시간 타이머 초기화
  const resetIdle = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(doLogout, 60 * 60 * 1000); // 60분
  }, [doLogout]);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    const handleScroll = () => {
      resetIdle();
    };

    // 사용자 활동 이벤트 감지
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keydown',
      'touchstart',
      'scroll',
    ];
    activityEvents.forEach((e) => window.addEventListener(e, resetIdle));
    el.addEventListener('scroll', handleScroll);
    resetIdle(); // 최초 실행 시 초기화

    return () => {
      activityEvents.forEach((e) => window.removeEventListener(e, resetIdle));
      el.removeEventListener('scroll', handleScroll);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [resetIdle, mainRef]);
};
