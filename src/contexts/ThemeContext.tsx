
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme;
    return stored || 'system';
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    
    const getSystemTheme = (): 'light' | 'dark' => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    let resolvedTheme: 'light' | 'dark';
    
    if (theme === 'system') {
      resolvedTheme = getSystemTheme();
    } else {
      resolvedTheme = theme;
    }

    setActualTheme(resolvedTheme);
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    // Add the resolved theme class
    root.classList.add(resolvedTheme);
    
    // Store the theme preference
    localStorage.setItem('theme', theme);

    // Listen for system theme changes when in system mode
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const newSystemTheme = getSystemTheme();
        setActualTheme(newSystemTheme);
        root.classList.remove('light', 'dark');
        root.classList.add(newSystemTheme);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Initialize theme on mount
  useEffect(() => {
    const root = window.document.documentElement;
    const getSystemTheme = (): 'light' | 'dark' => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    let initialTheme: 'light' | 'dark';
    if (theme === 'system') {
      initialTheme = getSystemTheme();
    } else {
      initialTheme = theme;
    }

    root.classList.remove('light', 'dark');
    root.classList.add(initialTheme);
    setActualTheme(initialTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
