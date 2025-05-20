// src/features/notifications/hooks/useNotificationSocket.ts
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Client } from '@stomp/stompjs';
import { useQueryClient } from '@tanstack/react-query';
import { Notification, addNotification } from '@/features/notifications';
import { toast } from 'react-toastify';

export const useNotificationSocket = (
  enabled: boolean,
  onMessage?: (n: Notification) => void,
) => {
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
      // debug: (str) => console.log('[STOMP]', str),
    });

    client.onConnect = () => {
      client.subscribe('/user/queue/notifications', (msg) => {
        const data: Notification = JSON.parse(msg.body);

        /* 1) Redux 빨간점 */
        dispatch(addNotification(data));

        /* 2) React-Query 캐시에 prepend */
        queryClient.setQueryData(
          ['notifications'], // ✅ 배열
          (prev: any) =>
            prev?.data
              ? { ...prev, data: [data, ...prev.data] }
              : { data: [data] },
        );

        /* 3) Toast */
        toast.info(data.message, {
          toastId: `noti-${data.id}`, // ★ 같은 id면 한 번만
          position: 'top-right',
          autoClose: 5000,
        });
        /* 4) 질문 생성 완료 ⇒ 해당 계약 질문 쿼리 무효화 */
        if (data.type === 'QUESTION_GENERATION' && data.contract_id) {
          queryClient.invalidateQueries({
            queryKey: ['questions', data.contract_id], // ⬅️ 필터 객체
          });
        }
        /* 5) 상위 컴포넌트에 이벤트 전달 → ✔️ 이 줄이 필요 */
        onMessage?.(data);
      });
    };

    client.activate();
    return () => void client.deactivate();
  }, [enabled, dispatch, queryClient, onMessage]);
};
