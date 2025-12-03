import { FaSearch, FaCircle, FaTimes, FaSpinner } from 'react-icons/fa';

const CheckUserOnline = ({ 
  checkEmail, 
  setCheckEmail, 
  checkedUsers, 
  setCheckedUsers,
  isChecking, 
  handleCheckUserOnline
}) => {
  const handleCheck = () => {
    if (checkEmail.trim()) {
      handleCheckUserOnline();
    }
  }

  const handleRemoveUser = (email) => {
    setCheckedUsers(prev => prev.filter(u => u.email !== email));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  return (
    <div className="bg-[#181818] rounded-xl p-6 border border-[#282828]">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FaSearch className="text-[#1db954]" />
        Check User Status
      </h2>

      {/* Search Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="email"
          value={checkEmail}
          onChange={(e) => setCheckEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter email to check..."
          className="flex-1 bg-[#282828] text-white px-4 py-3 rounded-lg border border-[#404040] focus:border-[#1db954] focus:outline-none text-sm"
          disabled={isChecking}
        />
        <button
          onClick={handleCheck}
          disabled={isChecking || !checkEmail.trim()}
          className="px-6 py-3 bg-[#1db954] text-black rounded-lg font-medium hover:bg-[#1ed760] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isChecking ? (
            <>
              <FaSpinner className="animate-spin" />
              Checking...
            </>
          ) : (
            'Check'
          )}
        </button>
      </div>

      {/* Checked Users List */}
      {checkedUsers.length > 0 && (
        <div className="space-y-2">
          <p className="text-[#b3b3b3] text-sm mb-2">Recent Checks:</p>
          {checkedUsers.map((user, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-[#282828] rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FaCircle 
                  className={`text-[10px] ${
                    user.isOnline ? 'text-green-500' : 'text-red-500'
                  }`} 
                />
                <span className="text-white text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  user.isOnline 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {user.isOnline ? 'Online' : 'Offline'}
                </span>
                <button
                  onClick={() => handleRemoveUser(user.email)}
                  className="text-[#b3b3b3] hover:text-white transition-colors"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {checkedUsers.length === 0 && (
        <div className="text-center py-4 text-[#b3b3b3] text-sm">
          Enter an email address to check if user is online
        </div>
      )}
    </div>
  );
};

export default CheckUserOnline;
