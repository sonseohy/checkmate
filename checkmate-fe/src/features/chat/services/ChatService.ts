import { fetchAssistantReply, ChatMessage } from '@features/chat';

export class ChatService {
  private history: ChatMessage[] = [];
  currentKey?: string;
  private readonly prefix = 'chat_history_v1_';

  /** 로그인시 호출 */
  setUser(userId: string | null) {
    if (this.currentKey) {
      localStorage.removeItem(this.currentKey);
      this.currentKey = undefined;
      this.history = [];
    }

    if (userId) {
      this.currentKey = this.prefix + userId;
      const raw = localStorage.getItem(this.currentKey);
      this.history = raw ? JSON.parse(raw) : [];
    } else {
      this.history = [];
    }
  }

  /** 현재 유저 이력 반환 */
  getMessages() {
    return this.history;
  }

  /** 로컬스토리지 동기화 */
  private persist() {
    if (!this.currentKey) return;
    localStorage.setItem(this.currentKey, JSON.stringify(this.history));
  }

  /** 메시지 전송 및 응답 처리 */
  async send(text: string, onUpdate: (msgs: ChatMessage[]) => void) {
    const userText = text.trim();
    if (!userText) return;

    this.history.push({ role: 'user', content: userText });
    this.history.push({ role: 'assistant', content: '...' });

    const typingIndex = this.history.length - 1;
    onUpdate([...this.history]);
    this.persist();

    try {
      const assistant = await fetchAssistantReply(userText);
      this.history[typingIndex] = assistant;
      onUpdate([...this.history]);
      this.persist();
    } catch {
      this.history[typingIndex] = {
        role: 'assistant',
        content: '[에러] 답변을 가져오지 못했습니다.',
      };
      onUpdate([...this.history]);
      this.persist();
    }
  }

  /** 대화 초기화 */
  resetHistory(onUpdate: (msgs: ChatMessage[]) => void) {
    this.history = [];
    this.persist();
    onUpdate([]);
  }

  /** 로그아웃 시 채팅 이력 완전 삭제 */
  clearUserData() {
    if (this.currentKey) {
      const keysToRemove = Object.keys(localStorage).filter((key) =>
        key.startsWith(this.prefix),
      );

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
      });

      this.currentKey = undefined;
      this.history = [];
    }
  }
}

export const chatService = new ChatService();
