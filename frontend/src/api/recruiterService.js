/**
 * Recruiter-related API functions
 */

import axiosInstance from './axios';

export const recruiterService = {
  // GET /api/recruiter/stats - Dashboard statistics
  getStats: async () => {
    try {
      const response = await axiosInstance.get('/api/recruiter/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // GET /api/recruiter/candidates - Search and filter candidates
  getCandidates: async (filters = {}) => {
    try {
      const response = await axiosInstance.get('/api/recruiter/candidates', {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // GET /api/recruiter/candidates/:id - Get candidate detail
  getCandidateDetail: async (candidateId) => {
    try {
      const response = await axiosInstance.get(`/api/recruiter/candidates/${candidateId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // POST /api/recruiter/star/:candidateId - Star/favorite a candidate
  starCandidate: async (candidateId) => {
    try {
      const response = await axiosInstance.post(`/api/recruiter/star/${candidateId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // DELETE /api/recruiter/star/:candidateId - Unstar a candidate
  unstarCandidate: async (candidateId) => {
    try {
      const response = await axiosInstance.delete(`/api/recruiter/star/${candidateId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // GET /api/recruiter/starred - Get all starred/saved candidates
  getStarredCandidates: async (filters = {}) => {
    try {
      const response = await axiosInstance.get('/api/recruiter/starred', {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // GET /api/recruiter/profile - Get recruiter profile
  getProfile: async () => {
    try {
      const response = await axiosInstance.get('/api/recruiter/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // PUT /api/recruiter/profile - Update recruiter profile
  updateProfile: async (profileData) => {
    try {
      const response = await axiosInstance.put('/api/recruiter/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // GET /api/recruiter/activity - Get recent activity
  getActivity: async (limit = 10) => {
    try {
      const response = await axiosInstance.get('/api/recruiter/activity', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Legacy methods (kept for compatibility)
  addToShortlist: async (candidateId) => {
    try {
      const response = await axiosInstance.post('/api/recruiter/shortlist', {
        candidateId,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  removeFromShortlist: async (candidateId) => {
    try {
      const response = await axiosInstance.delete(
        `/api/recruiter/shortlist/${candidateId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getShortlist: async () => {
    try {
      const response = await axiosInstance.get('/api/recruiter/shortlist');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  sendNotification: async (candidateId, message) => {
    try {
      const response = await axiosInstance.post('/api/recruiter/notifications', {
        candidateId,
        message,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
