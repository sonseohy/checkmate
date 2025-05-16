// 실시간 웹소켓 알림 수신
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Notification, addNotification } from '@/features/notifications';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const useNotificationSocket = (enabled: boolean) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!enabled) return;

    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    const connect = () => {
      socket = new WebSocket('wss://checkmate.ai.kr/app/');
      console.log('웹소켓 연결');

      socket.onmessage = (event) => {
        const data: Notification = JSON.parse(event.data);
        dispatch(addNotification(data));

        // ✅ 토스트 알림 표시
        toast.info(data.message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: true,
          draggable: true,
        });
      };

      socket.onclose = () => {
        console.log('❌ 웹소켓 닫힘. 5초후 재시도');
        reconnectTimer = setTimeout(connect, 5000);
      };

      socket.onerror = (err) => {
        console.error('⚠️ 웹소켓 에러:', err);
        socket?.close();
      };
    };

    connect();

    return () => {
      if (socket) socket.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [enabled, dispatch]);
};
