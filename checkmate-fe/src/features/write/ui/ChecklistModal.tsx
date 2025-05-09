import { ChecklistItem } from "@/features/write";
import { LuCheck } from "react-icons/lu";

interface ChecklistModalProps {
    checklist: ChecklistItem[];
    onClose: () => void;
  }

  const ChecklistModal: React.FC<ChecklistModalProps> = ({ checklist, onClose }) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-50">
        <div className="relative max-w-md w-full p-6 bg-white rounded-lg shadow-xl space-y-4">
          {/* 상단 타이틀만 */}
          <div className="flex justify-center border-b pb-2">
            <h2 className="text-2xl font-bold text-blue-700">CHECK LIST</h2>
          </div>
  
          {/* 내용 */}
          {checklist.length === 0 ? (
            <p className="text-center text-gray-500">등록된 체크리스트가 없습니다.</p>
          ) : (
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
          )}
  
          {/* 하단 확인 버튼 */}
          <div className="pt-4 text-center">
            <button
              onClick={onClose}
              className="inline-block px-4 py-2 mt-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ChecklistModal;