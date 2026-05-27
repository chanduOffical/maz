import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
       <div className="w-16 h-16 border-4 border-brand-mint border-t-deep-purple rounded-full animate-spin"></div>
       <p className="text-deep-purple/80">{message || 'Brewing your aesthetic...'}</p>
    </div>
  );
};

export default LoadingSpinner;