import { MessageCircle } from 'lucide-react';

interface Props {
  onClick: () => void;
  isVisible: boolean;
}

export const ChatbotButton = ({ onClick, isVisible }: Props) => {
  if (!isVisible) return null;

  return (
    <button
      onClick={onClick}
      className="fixed z-50 p-4 transition bg-blue-600 rounded-full shadow-lg bottom-6 right-6 hover:bg-blue-700"
    >
      <MessageCircle size={28} color="#fff" />
    </button>
  );
};
