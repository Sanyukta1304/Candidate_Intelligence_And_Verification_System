import React from 'react';

/**
 * Reusable Card Component
 * Follows Design System: White background, 8px radius, 16px padding, soft shadow
 */
export const Card = ({
  children,
  className = '',
  shadow = 'soft',
  onClick,
  ...props
}) => {
  const shadowClass = {
    soft: 'shadow-soft',
    'soft-lg': 'shadow-soft-lg',
    none: 'shadow-none',
  }[shadow];

  return (
    <div
      className={`bg-white-primary rounded-card border border-slate-300 ${shadowClass} p-4 ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Reusable Button Component
 * Follows Design System: Primary (Teal), Secondary (Teal border), Tertiary (Grey)
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  ...props
}) => {
  const variants = {
    primary:
      'bg-primary-teal text-white-primary hover:bg-teal-600 disabled:bg-slate-400 disabled:cursor-not-allowed',
    secondary:
      'bg-white-primary text-primary-teal border-2 border-primary-teal hover:bg-teal-light disabled:bg-slate-100 disabled:cursor-not-allowed',
    outline: 'border border-slate-300 text-slate-grey hover:bg-grey-mild disabled:bg-slate-100 disabled:cursor-not-allowed',
  };

  const sizes = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`font-semibold rounded-button transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="inline-block animate-spin mr-2">⌛</span>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

/**
 * Reusable Input Component
 * Follows Design System: 1px border, 6px radius, 10px padding, teal focus
 */
export const Input = ({
  label,
  error,
  type = 'text',
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-label text-primary-teal font-bold mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`w-full px-2.5 py-2.5 border rounded-input focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-transparent transition-all font-sans text-caption ${
          error ? 'border-status-error' : 'border-slate-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-status-error-text text-caption mt-1">{error}</p>}
    </div>
  );
};

/**
 * Reusable Alert Component
 */
export const Alert = ({
  type = 'error',
  message,
  onClose,
  className = '',
}) => {
  const types = {
    error: 'bg-red-50 border-red-200 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
  };

  return (
    <div
      className={`p-4 border rounded-lg flex justify-between items-center ${types[type]} ${className}`}
    >
      <p className="text-sm">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-xl font-bold opacity-70 hover:opacity-100"
        >
          ×
        </button>
      )}
    </div>
  );
};

/**
 * Loading Skeleton Component
 */
export const Skeleton = ({
  height = 'h-4',
  width = 'w-full',
  className = '',
  count = 1,
}) => {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${height} ${width} bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded animate-pulse mb-2`}
        />
      ))}
    </div>
  );
};
