/**
 * Project-related API functions
 */

import axiosInstance from './axios';

export const projectService = {
  // GET /api/projects - Get all projects for the candidate
  getProjects: async () => {
    try {
      const response = await axiosInstance.get('/api/projects');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // POST /api/projects - Create a new project
  createProject: async (projectData) => {
    try {
      const response = await axiosInstance.post('/api/projects', projectData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // PUT /api/projects/:id - Update a project
  updateProject: async (projectId, projectData) => {
    try {
      const response = await axiosInstance.put(`/api/projects/${projectId}`, projectData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // DELETE /api/projects/:id - Delete a project
  deleteProject: async (projectId) => {
    try {
      const response = await axiosInstance.delete(`/api/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
