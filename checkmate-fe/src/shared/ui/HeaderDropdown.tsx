import { ChevronDown } from 'lucide-react';

interface HeaderDropdownProps {
  open: boolean;
  onToggle: () => void;
  onItemClick: (categoryName: string) => void;
  title: string;
}

const HeaderDropdown = ({
  open,
  onToggle,
  onItemClick,
  title,
}: HeaderDropdownProps) => (
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
      <ul className="absolute left-0 z-10 w-40 mt-2 bg-white border rounded shadow-md top-full">
        {['계약서', '내용증명', '지급명령'].map((name) => (
          <li key={name}>
            <button
              onClick={() => onItemClick(name)}
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              {name}
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default HeaderDropdown;
