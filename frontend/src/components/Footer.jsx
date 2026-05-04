import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-grey-mild border-t border-slate-300" style={{ backgroundColor: 'var(--color-bg-secondary)', borderTopColor: 'var(--color-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-center">
        <div className="text-slate-grey text-caption" style={{ color: 'var(--color-text-secondary)' }}>
          © 2026 CredVerify. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
