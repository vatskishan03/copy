import React from 'react';
import Button from './Button';
import { useTheme } from '../provider/ThemeProvider';
import { Sun, Moon } from 'lucide-react'; 

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      className="text-white hover:bg-blue-700 dark:hover:bg-slate-800 w-2.55 rem h-2.55 rem p-0 flex items-center justify-center"
    >
      {theme === 'light' ? (
        <Moon className="h-7 w-7" />
      ) : (
        <Sun className="h-7 w-7" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}