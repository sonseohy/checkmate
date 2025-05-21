import Modal from 'react-modal';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { chatService, ChatMessage } from '@/features/chat';

Modal.setAppElement('#root');

interface ChatModalProps {
  onClose(): void;
}

const MAX_COLLAPSE_LEN = 400; // “더보기” 기준 글자 수
const isMobile = window.innerWidth < 640; // 간단 모바일 판별

const ChatModal = ({ onClose }: ChatModalProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(
    chatService.getMessages(),
  );
  const [input, setInput] = useState('');
  const [collapsedMap, setCollapsedMap] = useState<Record<number, boolean>>({});

  const scrollRef = useRef<HTMLDivElement>(null);

  /* ========== ESC 키로 모달 닫기 ========== */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  /* ========== 새 메시지 → 맨 아래로 스크롤 ========== */
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  /* ========== 메시지 전송 ========== */
  const handleSend = async () => {
    const text = input;
    setInput('');

    try {
      await chatService.send(text, setMessages);
    } catch (e) {
      toast.error('답변을 가져오는 중 오류가 발생했습니다.');
    }
  };

  /* ========== 말풍선 렌더 ========== */
  const renderContent = (msg: ChatMessage, idx: number) => {
    /* typing 애니메이션 */
    if (msg.content === '...') {
      return (
        <span className="inline-flex gap-[2px]">
          <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-200ms]" />
          <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-100ms]" />
          <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" />
        </span>
      );
    }

    /* 더보기/접기 */
    const over = msg.content.length > MAX_COLLAPSE_LEN;
    const collapsed = collapsedMap[idx];

    return (
      <>
        <span className="whitespace-pre-wrap">
          {over && collapsed
            ? msg.content.slice(0, MAX_COLLAPSE_LEN) + ' …'
            : msg.content}
        </span>
        {over && (
          <button
            className="ml-1 text-xs text-blue-600 underline"
            onClick={() =>
              setCollapsedMap((m) => ({ ...m, [idx]: !collapsed }))
            }
          >
            {collapsed ? '더보기' : '접기'}
          </button>
        )}
      </>
    );
  };

  return (
    <Modal
      isOpen
      onRequestClose={onClose}
      overlayClassName="fixed inset-0 z-40 bg-black/30"
      className="
        absolute bottom-4 left-1/2 -translate-x-1/2
        w-[90vw] h-[70vh]

        sm:bottom-6 sm:right-6 sm:left-auto sm:translate-x-0
        sm:w-[400px] sm:h-[460px]

        bg-white border border-gray-200 rounded-2xl shadow-2xl
        p-4 flex flex-col transition-all
      "
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold">체크메이트 챗봇</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-black">
          &times;
        </button>
      </div>

      {/* 메시지 리스트 */}
      <div
        ref={scrollRef}
        className="flex-1 p-2 overflow-y-auto bg-white"
        style={{ paddingBottom: isMobile ? 'env(safe-area-inset-bottom)' : 0 }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-start mb-2 ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'assistant' && (
              <img
                src="/icons/chatbot-avatar.png"
                alt="bot"
                className="w-6 h-6 mr-2 rounded-full"
              />
            )}
            <p
              className={`max-w-[75%] px-4 py-2 text-sm rounded-2xl shadow
                whitespace-pre-wrap break-words
                ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white ml-auto'
                    : 'bg-gray-200 text-gray-800 mr-auto'
                }`}
            >
              {renderContent(m, i)}
            </p>
          </div>
        ))}
      </div>

      {/* 입력창 */}
      <div className="flex gap-2 mt-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="메시지를 입력하세요"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          전송
        </button>
      </div>
    </Modal>
  );
};

export default ChatModal;
