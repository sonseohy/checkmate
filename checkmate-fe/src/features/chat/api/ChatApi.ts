import { customAxios } from '@/shared/api';
import type { ChatMessage } from '@/features/chat';

export async function fetchAssistantReply(
  userMessage: string,
): Promise<ChatMessage> {
  const res = await customAxios.post('/api/chatbot', {
    message: userMessage,
  });

  if (!res.data?.success) {
    throw new Error(res.data?.error || '챗봇 API 오류');
  }

  return { role: 'assistant', content: res.data.data };
}
