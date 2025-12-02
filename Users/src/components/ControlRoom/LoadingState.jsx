import { FaSpinner, FaHeadphones } from 'react-icons/fa';

const LoadingState = ({ message = 'Loading session...' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#181818] to-[#121212] flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-[#1db954]/20 rounded-full flex items-center justify-center mx-auto">
            <FaHeadphones className="text-4xl text-[#1db954]" />
          </div>
          <div className="absolute inset-0 w-20 h-20 mx-auto border-2 border-[#1db954]/30 rounded-full animate-ping" />
        </div>
        <FaSpinner className="text-3xl text-[#1db954] animate-spin mx-auto mb-4" />
        <p className="text-white text-lg font-medium">{message}</p>
        <p className="text-[#b3b3b3] text-sm mt-2">Please wait...</p>
      </div>
    </div>
  );
};

export default LoadingState;
