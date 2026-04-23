/**
 * Recruiter-related API functions
 */

import axiosInstance from './axios';

export const recruiterService = {
<<<<<<< HEAD
  // GET /api/recruiter/candidates
=======
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
>>>>>>> 57a1e520ceaf0e759720d82a067372c2c675ec15
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

<<<<<<< HEAD
  // GET /api/recruiter/candidates/:id
=======
  // GET /api/recruiter/candidates/:id - Get candidate detail
>>>>>>> 57a1e520ceaf0e759720d82a067372c2c675ec15
  getCandidateDetail: async (candidateId) => {
    try {
      const response = await axiosInstance.get(`/api/recruiter/candidates/${candidateId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

<<<<<<< HEAD
  // POST /api/recruiter/shortlist
=======
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
>>>>>>> 57a1e520ceaf0e759720d82a067372c2c675ec15
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

<<<<<<< HEAD
  // DELETE /api/recruiter/shortlist/:candidateId
=======
>>>>>>> 57a1e520ceaf0e759720d82a067372c2c675ec15
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

<<<<<<< HEAD
  // GET /api/recruiter/shortlist
=======
>>>>>>> 57a1e520ceaf0e759720d82a067372c2c675ec15
  getShortlist: async () => {
    try {
      const response = await axiosInstance.get('/api/recruiter/shortlist');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

<<<<<<< HEAD
  // POST /api/recruiter/notifications
=======
>>>>>>> 57a1e520ceaf0e759720d82a067372c2c675ec15
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
