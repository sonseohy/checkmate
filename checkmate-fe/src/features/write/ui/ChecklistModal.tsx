import { useState } from 'react';
import { ChecklistItem } from "@/features/write";
import { LuCheck, LuChevronDown, LuChevronUp } from "react-icons/lu";

interface ChecklistModalProps {
    checklist: ChecklistItem[];
    onClose: () => void;
  }

  const ChecklistModal: React.FC<ChecklistModalProps> = ({ checklist, onClose }) => {
    const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

    const toggleItem = (id: number) => {
      setOpenItems((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-50">
        <div className="relative max-w-md w-full p-6 bg-white rounded-lg shadow-xl space-y-4">
          {/* 상단 타이틀 */}
          <div className="flex justify-center border-b border-gray-400 pb-2">
            <h2 className="text-2xl font-bold text-gray-400">작성 전에 확인하세요!</h2>
          </div>
  
          {/* 리스트 본문 */}
          {checklist.length === 0 ? (
            <p className="text-center text-gray-500">등록된 체크리스트가 없습니다.</p>
          ) : (
            <ul className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {checklist.map((item) => {
                const isOpen = openItems[item.checkListId];
  
                return (
                  <li
                    key={item.checkListId}
                    className="bg-gray-100 rounded px-3 py-2 text-sm text-gray-700"
                  >
                    <button
                      onClick={() => toggleItem(item.checkListId)}
                      className="flex items-center justify-between w-full font-semibold text-left"
                    >
                      <div className="flex items-center gap-2">
                        <LuCheck className="text-blue-600 shrink-0" />
                        {item.title}
                      </div>
                      {isOpen ? (
                        <LuChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <LuChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
  
                    {isOpen && (
                      <div className="mt-2 px-1 text-sm text-gray-700 whitespace-pre-line transition-all duration-300">
                        {item.checkListDetail}
                      </div>
                    )}
                  </li>
                );
              })}
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