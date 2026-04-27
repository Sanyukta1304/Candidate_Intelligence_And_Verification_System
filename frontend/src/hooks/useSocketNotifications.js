import { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';

/**
 * Hook to listen for real-time notifications via Socket.IO
 * Automatically joins the user's notification room on mount
 */
export const useSocketNotifications = (userId, isAuthenticated) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Only connect if user is authenticated
    if (!isAuthenticated || !userId) {
      return;
    }

    // Get API URL from environment or use localhost
    const apiUrl = import.meta?.env?.VITE_API_URL || 'http://localhost:5000';

    // Connect to socket server
    const socketInstance = io(apiUrl, {
      auth: {
        userId: userId
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socketInstance.on('connect', () => {
      console.log('[Socket.IO] Connected:', socketInstance.id);
      
      // Join user's notification room
      socketInstance.emit('join', userId);
      console.log('[Socket.IO] Joined room:', userId);
    });

    // Listen for incoming notifications
    socketInstance.on('notification', (notification) => {
      console.log('[Socket.IO] Received notification:', notification);
      
      // Add notification to state
      setNotifications(prev => [notification, ...prev]);
    });

    socketInstance.on('disconnect', () => {
      console.log('[Socket.IO] Disconnected');
    });

    socketInstance.on('error', (error) => {
      console.error('[Socket.IO] Error:', error);
    });

    socketInstance.on('connect_error', (error) => {
      console.warn('[Socket.IO] Connection error:', error.message);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [userId, isAuthenticated]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
  }, []);

  return {
    socket,
    notifications,
    clearNotifications,
    removeNotification
  };
};
