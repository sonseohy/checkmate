// shared/ui/DarkModeToggle.tsx
import { useEffect } from 'react';
import { toggleTheme } from '@/features/theme/model/themeSlice';
import { Sun, Moon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';

const DarkModeToggle = () => {
  const dispatch = useAppDispatch();
  const isDark = useAppSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <button onClick={() => dispatch(toggleTheme())} className="p-2">
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default DarkModeToggle;
