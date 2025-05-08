import { ChecklistItem } from "@/features/write";
import { LuCheck, LuX } from "react-icons/lu";

interface ChecklistModalProps {
    checklist: ChecklistItem[];
    onClose: () => void;
  }

  const ChecklistModal: React.FC<ChecklistModalProps> = ({ checklist, onClose }) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative max-w-md w-full p-6 bg-white rounded-lg shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-bold text-blue-700">CHECK LIST</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">
              <LuX className="w-5 h-5" />
            </button>
          </div>
          <ul className="space-y-2">
            {checklist.map((item) => (
              <li
                key={item.checkListId}
                className="flex items-start gap-2 text-sm text-gray-700 bg-gray-100 rounded px-3 py-2"
              >
                <LuCheck className="mt-1 text-blue-600 shrink-0" />
                <span>{item.checkListDetail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  
  export default ChecklistModal;