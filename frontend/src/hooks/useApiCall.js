import axios from 'axios';

/**
 * Custom Hook: useApiCall
 * Simplifies making API calls with loading and error states
 * 
 * Usage:
 * const { data, loading, error, execute } = useApiCall();
 * 
 * const handleFetch = async () => {
 *   const result = await execute(() => candidateService.getProfile());
 * };
 */

import { useState } from 'react';

export const useApiCall = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = async (apiFunction) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { data, loading, error, execute, reset };
};
