import { useCallback } from 'react';

export const useErrorBoundary = () => {
  const showBoundary = useCallback((error: unknown) => {
    // In a real app, you would want to log this to your error tracking service
    console.error('Error caught by boundary:', error);
    
    // You can also trigger any error reporting service here
    // e.g., Sentry.captureException(error);
  }, []);

  return { showBoundary };
}; 