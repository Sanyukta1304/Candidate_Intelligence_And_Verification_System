import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);
    applyTheme(storedTheme);
  }, []);

  // Apply theme to document
  const applyTheme = (themeValue) => {
    try {
      // Apply to HTML root element (most important)
      const html = document.documentElement;
      if (html) {
        html.setAttribute('data-theme', themeValue);
        // Also set class for CSS targeting
        html.className = themeValue === 'dark' ? 'dark-theme' : 'light-theme';
      }
      
      // Fallback: also apply to body
      if (document.body) {
        document.body.className = themeValue === 'dark' ? 'dark-theme' : 'light-theme';
      }
    } catch (error) {
      console.warn('Error applying theme:', error);
    }
  };

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
