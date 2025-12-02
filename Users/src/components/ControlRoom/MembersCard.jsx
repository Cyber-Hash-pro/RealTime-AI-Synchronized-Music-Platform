import { useState } from 'react';
import { 
  FaUsers, 
  FaUserPlus, 
  FaCrown, 
  FaCircle, 
  FaTimes, 
  FaEnvelope, 
  FaTrash 
} from 'react-icons/fa';

const MembersCard = ({ 
  members, 
  onlineMembers, 
  offlineMembers,
  onRemoveMember,
  onInviteMember 
}) => {
  const [showAddMember, setShowAddMember] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      setInviteError('Please enter an email address');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      setInviteError('Please enter a valid email address');
      return;
    }

    try {
      await onInviteMember(inviteEmail);
      setInviteSuccess(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setInviteError('');
      setTimeout(() => {
        setInviteSuccess('');
        setShowAddMember(false);
      }, 2000);
    } catch (err) {
      setInviteError('Failed to send invitation');
    }
  };

  return (
    <div className="bg-[#181818] rounded-xl p-6 border border-[#282828]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FaUsers className="text-[#1db954]" />
          Members ({members.length})
        </h2>
        <button
          onClick={() => setShowAddMember(true)}
          className="p-2 bg-[#1db954] rounded-full hover:bg-[#1ed760] transition-colors"
          title="Add member"
        >
          <FaUserPlus className="text-black text-sm" />
        </button>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="mb-4 p-4 bg-[#282828] rounded-lg border border-[#404040]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Invite by Email</h3>
            <button 
              onClick={() => {
                setShowAddMember(false);
                setInviteEmail('');
                setInviteError('');
                setInviteSuccess('');
              }}
              className="text-[#b3b3b3] hover:text-white"
            >
              <FaTimes />
            </button>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b3b3b3]" />
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="friend@email.com"
                className="w-full bg-[#121212] text-white pl-10 pr-4 py-2 rounded-lg border border-[#404040] focus:border-[#1db954] focus:outline-none text-sm"
              />
            </div>
            <button
              onClick={handleInvite}
              className="px-4 py-2 bg-[#1db954] text-black rounded-lg font-medium hover:bg-[#1ed760] transition-colors text-sm"
            >
              Invite
            </button>
          </div>
          {inviteError && <p className="text-red-400 text-sm mt-2">{inviteError}</p>}
          {inviteSuccess && <p className="text-green-400 text-sm mt-2">{inviteSuccess}</p>}
        </div>
      )}

      {/* Members List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {members.map((member) => (
          <div 
            key={member.id}
            className="flex items-center gap-3 p-3 bg-[#282828] rounded-lg"
          >
            <div className="relative">
              <img 
                src={member.avatar} 
                alt={member.name}
                className="w-10 h-10 rounded-full"
              />
              {/* Online/Offline Indicator */}
              <FaCircle 
                className={`absolute -bottom-0.5 -right-0.5 text-[10px] ${
                  member.isOnline ? 'text-green-500' : 'text-red-500'
                } drop-shadow-lg`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-white font-medium truncate">{member.name}</p>
                {member.isHost && (
                  <FaCrown className="text-yellow-400 text-xs" title="Host" />
                )}
              </div>
              <p className="text-[#b3b3b3] text-sm truncate">{member.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                member.isOnline 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {member.isOnline ? 'Active' : 'Inactive'}
              </span>
              {!member.isHost && (
                <button
                  onClick={() => onRemoveMember(member.id)}
                  className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                  title="Remove member"
                >
                  <FaTrash className="text-xs" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Members Summary */}
      <div className="mt-4 pt-4 border-t border-[#282828] flex justify-between text-sm">
        <div className="flex items-center gap-2">
          <FaCircle className="text-green-500 text-[8px]" />
          <span className="text-[#b3b3b3]">{onlineMembers} Active</span>
        </div>
        <div className="flex items-center gap-2">
          <FaCircle className="text-red-500 text-[8px]" />
          <span className="text-[#b3b3b3]">{offlineMembers} Inactive</span>
        </div>
      </div>
    </div>
  );
};

export default MembersCard;
