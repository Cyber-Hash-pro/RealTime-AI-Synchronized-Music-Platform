import React from 'react';

const LoadingState = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#121212] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#1db954] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading song...</p>
      </div>
    </div>
  );
};

export default LoadingState;
