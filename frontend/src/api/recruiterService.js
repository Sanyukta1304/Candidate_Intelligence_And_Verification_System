/**
 * Recruiter-related API functions
 */

import axiosInstance from './axios';

export const recruiterService = {
  // GET /api/recruiter/candidates
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

  // GET /api/recruiter/candidates/:id
  getCandidateDetail: async (candidateId) => {
    try {
      const response = await axiosInstance.get(`/api/recruiter/candidates/${candidateId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // POST /api/recruiter/shortlist
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

  // DELETE /api/recruiter/shortlist/:candidateId
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

  // GET /api/recruiter/shortlist
  getShortlist: async () => {
    try {
      const response = await axiosInstance.get('/api/recruiter/shortlist');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // POST /api/recruiter/notifications
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
