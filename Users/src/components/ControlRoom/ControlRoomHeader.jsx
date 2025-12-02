import { FaArrowLeft, FaCrown } from 'react-icons/fa';

const ControlRoomHeader = ({ roomName, onlineMembers, offlineMembers, onBack }) => {
  return (
    <div className="p-4 sm:p-6 pb-2">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-white hover:text-[#1db954] transition-colors mb-4"
      >
        <FaArrowLeft className="text-xl" />
        <span className="text-lg font-medium">Back</span>
      </button>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <FaCrown className="text-yellow-400 text-lg" />
          <span className="text-[#b3b3b3] text-sm">Control Room</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{roomName || 'Session'}</h1>
        <p className="text-[#b3b3b3] text-sm">
          {onlineMembers} online · {offlineMembers} offline
        </p>
      </div>
    </div>
  );
};

export default ControlRoomHeader;
