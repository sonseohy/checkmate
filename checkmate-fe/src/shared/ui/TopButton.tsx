import { ArrowUp } from 'lucide-react';

interface TopButtonProps {
  onClick: () => void;
}

export const TopButton = ({ onClick }: TopButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed z-50 p-4 bg-gray-600 rounded-full shadow-lg bottom-24 right-6 transition hover:bg-gray-700"
    >
      <ArrowUp size={28} color="#fff" />
    </button>
  );
};
