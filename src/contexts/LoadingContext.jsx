import React, { createContext, useContext, useState, useCallback } from 'react';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true); // FORCE TRUE FOR DEMONSTRATION
  const [loadingText, setLoadingText] = useState('Loading...');
  const [showLoading, setShowLoading] = useState(true); // FORCE TRUE FOR DEMONSTRATION

  const startLoading = useCallback((message = 'Loading...') => {
    setLoadingText(message);
    setIsLoading(true);
    setShowLoading(true);
    console.log('LoadingContext: startLoading called with:', message);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setShowLoading(false);
    console.log('LoadingContext: stopLoading called');
  }, []);

  const updateLoadingText = useCallback((message) => {
    setLoadingText(message);
    console.log('LoadingContext: updateLoadingText called with:', message);
  }, []);

  const value = {
    isLoading,
    loadingText,
    showLoading,
    startLoading,
    stopLoading,
    updateLoadingText
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};


