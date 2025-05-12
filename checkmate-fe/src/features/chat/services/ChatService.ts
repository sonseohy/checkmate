import { fetchAssistantReply, ChatMessage } from '@features/chat';

const STORAGE_KEY = 'chat_history_v1';
const TYPING_PLACEHOLDER = '...';

class ChatService {
  private history: ChatMessage[] = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || '[]',
  );

  /** 캐시된 이력 반환 */
  getMessages() {
    return this.history;
  }

  /** 로컬스토리지 동기화 */
  private persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.history));
  }

  /** 사용자 발화 → 서버 호출 → 이력 갱신 (+타이핑) */
  async send(
    text: string,
    onUpdate: (msgs: ChatMessage[]) => void,
  ): Promise<void> {
    const userText = text.trim();
    if (!userText) return;

    // 1) 사용자 메시지 추가
    this.history.push({ role: 'user', content: userText });

    // 2) 타이핑(…) 추가
    this.history.push({ role: 'assistant', content: TYPING_PLACEHOLDER });
    const typingIndex = this.history.length - 1;
    onUpdate([...this.history]);
    this.persist();

    try {
      // 3) 서버 호출
      const assistant = await fetchAssistantReply(userText);

      // 4) 타이핑 말풍선을 실제 답변으로 교체
      this.history[typingIndex] = assistant;
      onUpdate([...this.history]);
      this.persist();
    } catch (e) {
      this.history[typingIndex] = {
        role: 'assistant',
        content: '[에러] 답변을 가져오지 못했습니다.',
      };
      onUpdate([...this.history]);
      this.persist();
      throw e;
    }
  }

  /** 대화 초기화 */
  reset(onUpdate: (msgs: ChatMessage[]) => void) {
    this.history = [];
    this.persist();
    onUpdate([]);
  }
}

export const chatService = new ChatService();
