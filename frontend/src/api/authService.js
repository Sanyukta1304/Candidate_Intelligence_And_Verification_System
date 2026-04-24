import axiosInstance from './axios';

export const authService = {
  // POST /api/auth/register
  register: async (name, email, password, role) => {
    try {
      const response = await axiosInstance.post('/api/auth/register', {
        username: name,
        email,
        password,
        passwordConfirm: password,
        role,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // POST /api/auth/login
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // GET /api/auth/github - Initiate GitHub OAuth
  githubAuth: async () => {
    try {
      const response = await axiosInstance.get('/api/auth/github');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // GET /api/auth/github/callback - Handle GitHub OAuth callback
  githubCallback: async (code, state) => {
    try {
      const response = await axiosInstance.post('/api/auth/github/callback', {
        code,
        state,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // GET /api/auth/me - Get current user info
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/api/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // POST /api/auth/logout
  logout: async () => {
    try {
      const response = await axiosInstance.post('/api/auth/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
