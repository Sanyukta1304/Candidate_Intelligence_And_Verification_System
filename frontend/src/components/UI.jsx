import React from 'react';

/**
 * Reusable Card Component
 * Used for consistent card styling throughout the app
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
      className={`bg-white rounded-xl border border-slate-200 ${shadowClass} p-6 ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Reusable Button Component
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
      'bg-primary-dark text-white hover:bg-slate-800 disabled:bg-slate-400',
    secondary:
      'bg-white text-primary-dark border-2 border-primary-dark hover:bg-primary-light',
    outline: 'border border-slate-200 text-slate-700 hover:bg-primary-light',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`font-semibold rounded-lg transition-colors disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
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
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition-all ${
          error ? 'border-red-500' : 'border-slate-200'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
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
