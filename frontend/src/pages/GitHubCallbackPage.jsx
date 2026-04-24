import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * GitHub OAuth Callback Handler
 * This page handles the redirect from GitHub OAuth flow
 * 
 * Expected URL pattern:
 * - Success: /auth/github/callback?token=xxx
 * - Error: /auth/github/callback?error=xxx
 */
export const GitHubCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, user: authUser, setAuthError } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get parameters from URL
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        // Handle errors
        if (error) {
          setAuthError(`GitHub authentication failed: ${error}`);
          // Redirect back to profile if user is authenticated
          if (authUser) {
            navigate('/candidate/profile', { replace: true });
          } else {
            navigate('/login', { replace: true });
          }
          return;
        }

        // Handle success
        if (token) {
          try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            
            // Fetch current user with updated GitHub verification status
            const response = await fetch(`${apiUrl}/api/auth/me`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });

            if (response.ok) {
              const data = await response.json();
              const user = data.user;
              
              // Login with the updated user data that includes github_verified flag
              login(user, token);
              
              // Redirect to profile for verification
              navigate('/candidate/profile', { replace: true });
            } else {
              setAuthError('Failed to fetch user information');
              navigate('/login', { replace: true });
            }
          } catch (err) {
            console.error('GitHub callback error:', err);
            setAuthError('Failed to complete GitHub authentication');
            navigate('/login', { replace: true });
          }
        } else {
          setAuthError('Invalid authentication response');
          navigate('/login', { replace: true });
        }
      } catch (err) {
        console.error('Callback handler error:', err);
        setAuthError('Authentication error occurred');
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [searchParams, login, navigate, setAuthError, authUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark mx-auto mb-4"></div>
        <p className="text-slate-600">Completing GitHub authentication...</p>
      </div>
    </div>
  );
};
