import { useEffect, useRef } from 'react';
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        if (open) onToggle(); // 열려 있을 때만 닫기
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
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
        <ul className="absolute left-0 z-10 w-40 mt-2 bg-white border rounded shadow-md top-full">
          {categoryNames.map((name) => (
            <li key={name}>
              <button
                onClick={() => onItemClick(name)}
                className="block w-full px-4 py-2 text-left hover:bg-[#60A5FA] hover:text-white"
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
