import { create } from 'zustand';

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const useTheme = create<ThemeState>((set) => ({
  isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches || 
               localStorage.getItem('theme') === 'dark',
  toggleTheme: () => set((state) => {
    const newDarkMode = !state.isDarkMode;
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { isDarkMode: newDarkMode };
  }),
}));

// Initialize theme on load
if (typeof window !== 'undefined') {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches || 
                 localStorage.getItem('theme') === 'dark';
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
