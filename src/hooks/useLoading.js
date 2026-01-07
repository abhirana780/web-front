import { useState, useCallback } from 'react';

export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [loadingText, setLoadingText] = useState('Loading...');

  const startLoading = useCallback((message = 'Loading...') => {
    setIsLoading(true);
    setLoadingText(message);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const setLoadingMessage = useCallback((message) => {
    setLoadingText(message);
  }, []);

  return {
    isLoading,
    loadingText,
    startLoading,
    stopLoading,
    setLoadingMessage
  };
};

export default useLoading;
