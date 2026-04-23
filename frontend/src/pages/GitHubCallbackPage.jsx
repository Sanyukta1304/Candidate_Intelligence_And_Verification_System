import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GitHubCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, setAuthError } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const userStr = searchParams.get('user');
        const error = searchParams.get('error');

        if (error) {
          setAuthError(`GitHub authentication failed: ${error}`);
          navigate('/login', { replace: true });
          return;
        }

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            login(user, token);
            navigate('/dashboard', { replace: true });
          } catch (err) {
            setAuthError('Failed to parse authentication response');
            navigate('/login', { replace: true });
          }
        } else {
          setAuthError('Invalid authentication response');
          navigate('/login', { replace: true });
        }
      } catch (err) {
        setAuthError('Authentication error occurred');
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [searchParams, login, navigate, setAuthError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark mx-auto mb-4"></div>
        <p className="text-slate-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default GitHubCallbackPage;