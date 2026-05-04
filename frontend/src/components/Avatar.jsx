import React from 'react';

/**
 * Avatar Component
 * Displays a circular avatar with user initial
 * Generates different colors based on initial letter
 */
export const Avatar = ({ name, size = 'md', className = '' }) => {
  // Get initial from name
  const getInitial = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  // Generate color based on initial letter
  const getColorClasses = (initial) => {
    const code = initial.charCodeAt(0);
    
    // Color mapping: A-F (green), G-L (blue), M-R (purple), S-Z (orange)
    if (code >= 65 && code <= 70) { // A-F
      return {
        light: 'bg-emerald-100',
        dark: 'dark:bg-emerald-900',
        textLight: 'text-emerald-700',
        textDark: 'dark:text-emerald-200'
      };
    } else if (code >= 71 && code <= 76) { // G-L
      return {
        light: 'bg-blue-100',
        dark: 'dark:bg-blue-900',
        textLight: 'text-blue-700',
        textDark: 'dark:text-blue-200'
      };
    } else if (code >= 77 && code <= 82) { // M-R
      return {
        light: 'bg-purple-100',
        dark: 'dark:bg-purple-900',
        textLight: 'text-purple-700',
        textDark: 'dark:text-purple-200'
      };
    } else { // S-Z and others
      return {
        light: 'bg-amber-100',
        dark: 'dark:bg-amber-900',
        textLight: 'text-amber-700',
        textDark: 'dark:text-amber-200'
      };
    }
  };

  const initial = getInitial(name);
  const colors = getColorClasses(initial);

  // Size mapping
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  return (
    <div
      className={`
        rounded-full
        flex items-center justify-center
        font-semibold
        flex-shrink-0
        transition-all duration-200
        ${sizeClasses[size]}
        ${colors.light} ${colors.dark}
        ${colors.textLight} ${colors.textDark}
        ${className}
      `}
      title={name}
      style={{
        backgroundColor: 'var(--avatar-bg, #e0f2fe)',
        color: 'var(--avatar-text, #0369a1)'
      }}
    >
      {initial}
    </div>
  );
};
