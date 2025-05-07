import { ChatMessage } from '@/features/chat';

export class ChatService {
  static history: ChatMessage[] = [];

  static addMessage(msg: ChatMessage) {
    this.history.push(msg);
  }

  static getHistory(): ChatMessage[] {
    return this.history;
  }
}
