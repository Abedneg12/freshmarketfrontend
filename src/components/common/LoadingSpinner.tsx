import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center p-10">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );
};

export default LoadingSpinner;