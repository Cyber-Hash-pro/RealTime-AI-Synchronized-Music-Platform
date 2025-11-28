import React from 'react';

const ErrorState = ({ error, onGoBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#121212] flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-400 text-xl mb-4">{error || 'Song not found'}</p>
        <button 
          onClick={onGoBack}
          className="bg-[#1db954] text-white px-6 py-3 rounded-full hover:bg-[#1ed760] transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
