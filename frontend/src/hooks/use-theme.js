import { useEffect, useState } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return {
    theme,
    setTheme,
  };
};