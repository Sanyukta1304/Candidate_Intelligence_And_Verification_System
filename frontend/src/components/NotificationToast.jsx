import React, { useState, useEffect } from 'react';

/**
 * Toast Notification Component
 * Displays notification at top right with auto-dismiss after 5 seconds
 */
export const NotificationToast = ({ 
  notification, 
  onDismiss,
  autoClose = true,
  duration = 5000 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!autoClose) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [autoClose, duration, onDismiss]);

  if (!isVisible) return null;

  // Determine icon and color based on notification type
  const getNotificationStyle = () => {
    if (notification.type === 'profile_viewed') {
      return {
        icon: '👁️',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-900'
      };
    } else if (notification.type === 'profile_starred') {
      return {
        icon: '⭐',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-900'
      };
    }
    return {
      icon: '📌',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      textColor: 'text-slate-900'
    };
  };

  const style = getNotificationStyle();

  return (
    <div
      className={`fixed top-4 right-4 max-w-sm ${style.bgColor} border ${style.borderColor} rounded-lg shadow-lg p-4 animate-slideInRight z-50`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{style.icon}</span>
        
        <div className="flex-1">
          <p className={`${style.textColor} font-semibold`}>
            {notification.message || notification.recruiter_name || 'New notification'}
          </p>
          <p className="text-sm text-slate-600 mt-1">
            {notification.company_name && `from ${notification.company_name}`}
          </p>
        </div>

        <button
          onClick={() => {
            setIsVisible(false);
            onDismiss();
          }}
          className="text-slate-400 hover:text-slate-600 flex-shrink-0 text-xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Auto-dismiss progress bar */}
      {autoClose && (
        <div className="mt-3 w-full bg-slate-200 rounded-full h-1 overflow-hidden">
          <div
            className={`h-full ${
              notification.type === 'profile_viewed'
                ? 'bg-blue-500'
                : notification.type === 'profile_starred'
                ? 'bg-yellow-500'
                : 'bg-slate-500'
            } animate-shrink`}
            style={{ animation: `shrink ${duration}ms linear forwards` }}
          />
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }

        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-shrink {
          animation: shrink linear forwards;
        }
      `}</style>
    </div>
  );
};

/**
 * Toast Container Component
 * Manages multiple toast notifications
 */
export const ToastContainer = ({ notifications, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      {notifications.map((notification, index) => (
        <div key={notification._id || index} className="pointer-events-auto mb-3">
          <NotificationToast
            notification={notification}
            onDismiss={() => onDismiss(notification._id)}
            autoClose={true}
            duration={5000}
          />
        </div>
      ))}
    </div>
  );
};
