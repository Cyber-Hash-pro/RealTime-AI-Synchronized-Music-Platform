import { FaCopy, FaCheck, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const SessionCodeCard = ({ code, isPrivate, password, copied, showPassword, onCopy, onTogglePassword }) => {
  return (
    <div className="bg-[#282828] rounded-lg p-4 border border-[#404040]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#b3b3b3] text-xs font-medium">Session Code</span>
        {isPrivate && (
          <span className="flex items-center gap-1 text-yellow-400 text-xs">
            <FaLock className="text-[10px]" />
            Private
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-mono font-bold text-white tracking-[0.2em]">
          {code}
        </span>
        <button
          onClick={onCopy}
          className="p-1.5 bg-[#404040] hover:bg-[#505050] rounded-lg transition-colors"
          title="Copy code"
        >
          {copied ? <FaCheck className="text-green-400 text-sm" /> : <FaCopy className="text-white text-sm" />}
        </button>
      </div>
      
      {isPrivate && password && (
        <div className="pt-2 mt-2 border-t border-[#404040]">
          <div className="flex items-center justify-between">
            <span className="text-[#b3b3b3] text-xs">Password</span>
            <button
              onClick={onTogglePassword}
              className="text-[#b3b3b3] hover:text-white text-sm"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <p className="text-white font-mono text-sm mt-1">
            {showPassword ? password : '••••••••'}
          </p>
        </div>
      )}
    </div>
  );
};

export default SessionCodeCard;
