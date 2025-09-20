import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Always use dark theme
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Always apply dark theme to document root
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  const toggleTheme = () => {
    // Theme toggle disabled - always stay in dark mode
    console.log('Theme switching disabled - staying in dark mode');
  };

  const value = {
    theme: 'dark',
    toggleTheme,
    isDark: true,
    isLight: false
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
