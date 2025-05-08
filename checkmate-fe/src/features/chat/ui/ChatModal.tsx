import Modal from 'react-modal';
import { useEffect, useRef, useState } from 'react';
import { ChatMessage, sendChatMessage } from '@/features/chat';

Modal.setAppElement('#root');

interface ChatModalProps {
  onClose: () => void;
}

export const ChatModal = ({ onClose }: ChatModalProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const response = await sendChatMessage(input);
    setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
  };

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={true}
      overlayClassName="fixed inset-0 z-40"
      className="absolute bottom-6 right-6 w-[400px] h-[460px] bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 flex flex-col transition-all duration-500 ease-out"
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold">체크메이트 챗봇</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-black">
          ✕
        </button>
      </div>

      <div
        ref={containerRef}
        className="flex-1 p-2 overflow-y-auto bg-white rounded"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start mb-2 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <img
                src="/icons/chatbot-avatar.png"
                alt="bot"
                className="w-6 h-6 mr-2 rounded-full"
              />
            )}
            <p
              className={`relative max-w-[75%] px-4 py-2 text-sm rounded-2xl whitespace-pre-wrap shadow-md ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white ml-auto'
                  : 'bg-gray-200 text-gray-800 mr-auto'
              }`}
            >
              {msg.content}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <input
          className="flex-1 px-3 py-2 transition-shadow border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="메시지를 입력하세요"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
        >
          전송
        </button>
      </div>
    </Modal>
  );
};
