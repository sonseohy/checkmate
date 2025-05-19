// src/features/notifications/hooks/useNotificationSocket.ts
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Client } from '@stomp/stompjs';
import { useQueryClient } from '@tanstack/react-query';
import { Notification, addNotification } from '@/features/notifications';
import { toast } from 'react-toastify';

export const useNotificationSocket = (enabled: boolean) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const WS_URL = `${protocol}://checkmate.ai.kr/app/`;

    const client = new Client({
      brokerURL: WS_URL,

      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      reconnectDelay: 5000,
      debug: (str) => console.log('[STOMP]', str),
    });

    client.onConnect = () => {
      console.log('✅ STOMP 연결 완료');

      client.subscribe('/user/queue/notifications', (msg) => {
        const data: Notification = JSON.parse(msg.body);

        /* 1) Redux 빨간점 */
        dispatch(addNotification(data));

        /* 2) React-Query 캐시에 prepend */
        queryClient.setQueryData(['notifications'], (prev: any) =>
          prev?.data
            ? { ...prev, data: [data, ...prev.data] }
            : { data: [data] },
        );

        /* 3) Toast */
        toast.info(data.message, { position: 'top-right', autoClose: 5000 });
      });
    };

    client.activate();

    /* ⬇️  cleanup — Promise를 반환하지 않도록 ‘void’로 호출 */
    return () => {
      void client.deactivate();
    };
  }, [enabled, dispatch, queryClient]);
};
