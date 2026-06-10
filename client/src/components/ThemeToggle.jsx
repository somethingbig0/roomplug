import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('roomplug-theme');

    if (savedTheme === 'dark') {
      document.documentElement.classList.add('roomplug-dark');
      document.body.classList.add('roomplug-dark');
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove('roomplug-dark');
      document.body.classList.remove('roomplug-dark');
      setDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    const nextMode = !darkMode;

    setDarkMode(nextMode);

    if (nextMode) {
      document.documentElement.classList.add('roomplug-dark');
      document.body.classList.add('roomplug-dark');
      localStorage.setItem('roomplug-theme', 'dark');
    } else {
      document.documentElement.classList.remove('roomplug-dark');
      document.body.classList.remove('roomplug-dark');
      localStorage.setItem('roomplug-theme', 'light');
    }
  };

  return (
    <button
      type='button'
      onClick={toggleTheme}
      aria-label='Toggle dark mode'
      className='fixed bottom-5 right-5 z-[9999] flex items-center gap-2 rounded-full border border-sky-100 bg-white/90 px-4 py-3 text-sky-600 shadow-xl shadow-sky-200/50 backdrop-blur-xl hover:bg-sky-50 hover:scale-[1.03] active:scale-95 transition'
    >
      <span className='flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-sm'>
        {darkMode ? '☀️' : '🌙'}
      </span>

      <span className='hidden sm:inline text-sm font-semibold'>
        {darkMode ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}