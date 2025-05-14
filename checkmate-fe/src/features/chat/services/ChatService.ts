import { fetchAssistantReply, ChatMessage } from '@features/chat';

export class ChatService {
  private history: ChatMessage[] = [];
  currentKey?: string; // 디버깅을 위해 public으로 변경
  private readonly prefix = 'chat_history_v1_';

  constructor() {
    // 생성자에서 현재 로컬 스토리지 키 확인
    // console.log(
    //   'ChatService 초기화 - 현재 로컬 스토리지 키:',
    //   Object.keys(localStorage),
    // );
  }

  /** 로그인시 호출 */
  setUser(userId: string | null) {
    // console.log(
    //   'setUser 호출됨, 이전 키:',
    //   this.currentKey,
    //   '새 userId:',
    //   userId,
    // );

    // 이전 사용자의 키가 있다면 먼저 메모리에서 초기화
    if (this.currentKey) {
      // console.log(`${this.currentKey} 키 삭제 시도`);
      localStorage.removeItem(this.currentKey);
      this.currentKey = undefined;
      this.history = [];
    }

    if (userId) {
      this.currentKey = this.prefix + userId;
      // console.log(`새 사용자 키 설정: ${this.currentKey}`);
      const raw = localStorage.getItem(this.currentKey);
      this.history = raw ? JSON.parse(raw) : [];
    } else {
      // 로그아웃 시 (이미 위에서 초기화됨)
      // console.log('로그아웃 시 채팅 이력 초기화 완료');
    }

    // 현재 로컬 스토리지 상태 확인
    // console.log('현재 로컬 스토리지 키:', Object.keys(localStorage));
  }

  /** 현재 유저 이력 반환 */
  getMessages() {
    return this.history;
  }

  /** 로컬스토리지 동기화 */
  private persist() {
    if (!this.currentKey) return;
    // console.log(`${this.currentKey}에 데이터 저장 중`);
    localStorage.setItem(this.currentKey, JSON.stringify(this.history));
  }

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

  /** 대화 초기화 (세션 중에도 이력만 비우고 싶다면 사용) */
  resetHistory(onUpdate: (msgs: ChatMessage[]) => void) {
    this.history = [];
    this.persist();
    onUpdate([]);
  }

  /** 로그아웃 시 채팅 이력 완전히 삭제 */
  clearUserData() {
    if (this.currentKey) {
      // 강제로 모든 chat_history_v1_ 로 시작하는 키 삭제
      const keysToRemove = Object.keys(localStorage).filter((key) =>
        key.startsWith(this.prefix),
      );

      console.log(`삭제할 채팅 이력 키: ${keysToRemove.join(', ')}`);

      // 모든 관련 키 삭제
      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
        // console.log(`${key} 삭제됨`);
      });

      // 현재 키 초기화
      this.currentKey = undefined;
      this.history = [];
      // console.log('채팅 이력이 완전히 삭제되었습니다.');
    } else {
      // console.log('삭제할 채팅 이력 키가 없습니다.');
    }
  }
}

export const chatService = new ChatService();
