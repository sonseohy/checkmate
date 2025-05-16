import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Client } from '@stomp/stompjs';
import { Notification, addNotification } from '@/features/notifications';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const useNotificationSocket = (enabled: boolean) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!enabled) return;

    const client = new Client({
      brokerURL: 'ws://checkmate.ai.kr/app/',
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      reconnectDelay: 5000,
      debug: (str) => console.log('[STOMP]', str),
      onConnect: () => {
        console.log('✅ STOMP 연결 완료');

        // ✅ 알림 구독
        client.subscribe('/user/queue/notifications', (message) => {
          const data: Notification = JSON.parse(message.body);
          dispatch(addNotification(data));

          toast.info(data.message, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            pauseOnHover: true,
            draggable: true,
          });
        });
      },
      onStompError: (frame) => {
        console.error('❌ STOMP 에러:', frame.headers['message']);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [enabled, dispatch]);
};
