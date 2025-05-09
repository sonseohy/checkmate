import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

interface HeaderDropdownProps {
  open: boolean;
  onToggle: () => void;
  onItemClick: (categoryName: string) => void;
  title: string;
  categoryNames: string[];
}

const HeaderDropdown = ({
  open,
  onToggle,
  onItemClick,
  title,
  categoryNames,
}: HeaderDropdownProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-1 hover:text-blue-600"
      >
        {title}
        <ChevronDown
          size={16}
          className={open ? 'rotate-180 transition-transform' : ''}
        />
      </button>

      {open && (
        <ul className="absolute left-0 z-10 w-44 mt-2 bg-white border rounded shadow-md top-full py-2 text-sm text-gray-800">
          {/* 계약서 작성 가이드 */}
          <li>
            <button
              onClick={() => {
                navigate('/intro/write');
                onToggle(); // 드롭다운 닫기
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              계약서 작성 가이드
            </button>
          </li>

          {/* 구분선 */}
          <li>
            <hr className="my-2 border-gray-200" />
          </li>

          {/* 카테고리 목록 */}
          {categoryNames.map((name) => (
            <li key={name}>
              <button
                onClick={() => {
                  onItemClick(name);
                  onToggle();
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HeaderDropdown;