/**
 * Candidate-related API functions
 */

import axiosInstance from './axios';

export const candidateService = {
  // GET /api/candidate/profile
  getProfile: async () => {
    try {
      const response = await axiosInstance.get('/api/candidate/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // PUT /api/candidate/profile
  updateProfile: async (profileData) => {
    try {
      const response = await axiosInstance.put('/api/candidate/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // GET /api/candidate/resume
  getResume: async () => {
    try {
      const response = await axiosInstance.get('/api/candidate/resume');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // POST /api/candidate/resume
  uploadResume: async (file) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const response = await axiosInstance.post('/api/candidate/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // GET /api/candidate/projects
  getProjects: async () => {
    try {
      const response = await axiosInstance.get('/api/candidate/projects');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // POST /api/candidate/projects
  createProject: async (projectData) => {
    try {
      const response = await axiosInstance.post('/api/candidate/projects', projectData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // PUT /api/candidate/projects/:id
  updateProject: async (projectId, projectData) => {
    try {
      const response = await axiosInstance.put(
        `/api/candidate/projects/${projectId}`,
        projectData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // DELETE /api/candidate/projects/:id
  deleteProject: async (projectId) => {
    try {
      const response = await axiosInstance.delete(`/api/candidate/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // GET /api/candidate/score
  getScoreCard: async () => {
    try {
      const response = await axiosInstance.get('/api/candidate/score');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // POST /api/candidate/github/verify - Verify GitHub connection
  verifyGithub: async () => {
    try {
      const response = await axiosInstance.post('/api/candidate/github/verify');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // GET /api/auth/github - Initiate GitHub OAuth
  initiateGithubAuth: async () => {
    try {
      const response = await axiosInstance.get('/api/auth/github');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
