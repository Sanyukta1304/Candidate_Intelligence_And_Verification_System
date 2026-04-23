/**
 * API Configuration and Error Handling
 * Exports configured Axios instance and utility functions
 */

import axiosInstance from './axios';

// Error handler utility
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with status code out of 2xx range
    return {
      message: error.response.data?.message || 'An error occurred',
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'No response from server',
      status: null,
      data: null,
    };
  } else {
    // Error in request setup
    return {
      message: error.message,
      status: null,
      data: null,
    };
  }
};

export default axiosInstance;
