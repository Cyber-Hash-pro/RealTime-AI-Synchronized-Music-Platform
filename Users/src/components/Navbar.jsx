import { FaSearch, FaBars, FaChevronDown, FaBell, FaUser, FaCog, FaSignOutAlt, FaRobot, FaTimes, FaPalette, FaGlobe, FaMicrophone, FaLock, FaBaby, FaCircle } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../Store/actions/userAction';

const Navbar = ({ onMenuClick }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('account');
  const [cyberAIConnected, setCyberAIConnected] = useState(false);
  const settingsRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get user from Redux store
  const { user, isAuthenticated } = useSelector((state) => state.user);

  // Close settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setIsSettingsOpen(false);
    navigate('/login');
  };

  // Get user display info
  const getUserName = () => {
    if (user?.fullName) {
      return `${user.fullName.firstName} ${user.fullName.lastName}`;
    }
    return 'Guest';
  };

  const getUserInitials = () => {
    if (user?.fullName) {
      return `${user.fullName.firstName?.charAt(0) || ''}${user.fullName.lastName?.charAt(0) || ''}`.toUpperCase();
    }
    return 'G';
  };

  const getUserAvatar = () => {
    return `https://placehold.co/100x100/1db954/ffffff?text=${getUserInitials()}`;
  };

  const SettingsModal = () => {
    const sidebarItems = [
      {
        id: 'account',
        label: 'Account',
        icon: <FaUser />,
        items: [
          { id: 'general', label: 'General', icon: <FaCog /> },
          { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
          { id: 'personalization', label: 'Personalization', icon: <FaPalette /> },
          { id: 'security', label: 'Security', icon: <FaLock /> },
          { id: 'privacy', label: 'Privacy', icon: <FaLock /> },
          { id: 'parental', label: 'Parental controls', icon: <FaBaby /> }
        ]
      },
      {
        id: 'cyber-ai',
        label: 'Cyber AI',
        icon: <FaRobot />,
        items: [
          { id: 'ai-settings', label: 'AI Settings', icon: <FaRobot /> },
          { id: 'recommendations', label: 'Recommendations', icon: <FaCog /> }
        ]
      }
    ];

    const renderContent = () => {
      if (activeSection === 'general') {
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-white text-xl font-semibold mb-6">General</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Appearance</h4>
                  </div>
                  <select className="bg-[#282828] text-white px-3 py-2 rounded-lg border border-[#3e3e3e] focus:outline-none focus:ring-2 focus:ring-[#1db954]">
                    <option>System</option>
                    <option>Dark</option>
                    <option>Light</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Accent color</h4>
                  </div>
                  <select className="bg-[#282828] text-white px-3 py-2 rounded-lg border border-[#3e3e3e] focus:outline-none focus:ring-2 focus:ring-[#1db954]">
                    <option>Default</option>
                    <option>Blue</option>
                    <option>Red</option>
                    <option>Purple</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Language</h4>
                  </div>
                  <select className="bg-[#282828] text-white px-3 py-2 rounded-lg border border-[#3e3e3e] focus:outline-none focus:ring-2 focus:ring-[#1db954]">
                    <option>Auto-detect</option>
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-white font-medium">Spoken language</h4>
                    </div>
                    <select className="bg-[#282828] text-white px-3 py-2 rounded-lg border border-[#3e3e3e] focus:outline-none focus:ring-2 focus:ring-[#1db954]">
                      <option>Auto-detect</option>
                      <option>English</option>
                      <option>Spanish</option>
                    </select>
                  </div>
                  <p className="text-[#b3b3b3] text-sm">For best results, select the language you mainly speak. If it's not listed, it may still be supported via auto-detection.</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Voice</h4>
                  </div>
                  <select className="bg-[#282828] text-white px-3 py-2 rounded-lg border border-[#3e3e3e] focus:outline-none focus:ring-2 focus:ring-[#1db954]">
                    <option>Default Voice</option>
                    <option>Voice 1</option>
                    <option>Voice 2</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      }

      if (activeSection === 'cyber-ai') {
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-white text-xl font-semibold mb-6">Cyber AI Assistant</h3>
              
              {/* Connection Status */}
              <div className={`flex items-center gap-3 p-4 rounded-lg mb-6 ${
                cyberAIConnected 
                  ? 'bg-green-500/10 border border-green-500/30' 
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                <FaCircle className={`text-xs ${cyberAIConnected ? 'text-green-500' : 'text-red-500'} animate-pulse`} />
                <span className={`font-medium ${cyberAIConnected ? 'text-green-400' : 'text-red-400'}`}>
                  {cyberAIConnected ? 'Connected to Cyber-AI' : 'Not yet connected to Cyber-AI'}
                </span>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/20 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <FaRobot className="text-white text-xl" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg">Cyber-AI Music Assistant</h4>
                    <p className="text-[#b3b3b3]">Your intelligent music companion</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-white font-medium">Enable AI Recommendations</h5>
                      <p className="text-[#b3b3b3] text-sm">Get personalized music suggestions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-[#282828] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-white font-medium">Voice Interaction</h5>
                      <p className="text-[#b3b3b3] text-sm">Talk to Cyber-AI using voice commands</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-[#282828] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-white font-medium">Smart Playlists</h5>
                      <p className="text-[#b3b3b3] text-sm">Auto-generate playlists based on mood</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-[#282828] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setCyberAIConnected(!cyberAIConnected)}
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-all ${
                  cyberAIConnected 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                }`}
              >
                {cyberAIConnected ? 'Disconnect from Cyber-AI' : 'Connect to Cyber-AI'}
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <h3 className="text-white text-xl font-semibold">Account Settings</h3>
          
          {/* User Profile Card */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#282828]">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={getUserAvatar()}
                alt={getUserName()}
                className="w-16 h-16 rounded-full ring-2 ring-[#1db954]"
              />
              <div>
                <h4 className="text-white font-semibold text-lg">{getUserName()}</h4>
                <p className="text-[#b3b3b3] text-sm">{user?.email || 'No email'}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-[#1db954]/20 text-[#1db954] text-xs rounded-full">
                  {user?.role === 'artist' ? 'Artist' : 'Premium'}
                </span>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 border border-red-500/30 py-2.5 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              <FaSignOutAlt />
              Sign Out
            </button>
          </div>
          
          <p className="text-[#b3b3b3]">Manage your account preferences and settings from the sidebar menu.</p>
        </div>
      );
    };

    return (
      <>
        {/* Blur Background */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsSettingsOpen(false)}
        />
        
        {/* Settings Modal */}
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-[#121212] rounded-lg w-full max-w-6xl h-[90vh] flex overflow-hidden border border-[#282828]">
            {/* Sidebar */}
            <div className="w-72 bg-[#0a0a0a] border-r border-[#282828] p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-white text-lg font-semibold">Settings</h2>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="text-[#b3b3b3] hover:text-white p-2 hover:bg-[#282828] rounded-lg transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Navigation */}
              <div className="space-y-2">
                {sidebarItems.map((section) => (
                  <div key={section.id}>
                    <div 
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                        activeSection.startsWith(section.id) 
                          ? 'bg-[#282828] text-white' 
                          : 'text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a]'
                      }`}
                      onClick={() => setActiveSection(section.id)}
                    >
                      <span className="text-lg">{section.icon}</span>
                      <span className="font-medium">{section.label}</span>
                    </div>
                    
                    {/* Subitems */}
                    {section.items && (
                      <div className="ml-6 space-y-1">
                        {section.items.map((item) => (
                          <div
                            key={item.id}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                              activeSection === item.id 
                                ? 'bg-[#282828] text-white' 
                                : 'text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a]'
                            }`}
                            onClick={() => setActiveSection(item.id)}
                          >
                            <span className="text-sm">{item.icon}</span>
                            <span className="text-sm">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <nav className="bg-black/95 backdrop-blur-md border-b border-[#282828] px-4 lg:px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-50">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-white text-xl p-2.5 hover:bg-[#282828] rounded-lg transition-colors shrink-0"
          aria-label="Toggle menu"
        >
          <FaBars />
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-md lg:max-w-2xl">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#b3b3b3] text-sm pointer-events-none" />
            <input
              type="text"
              placeholder="What do you want to listen to?"
              className="w-full bg-[#242424] text-white text-sm lg:text-[15px] pl-12 pr-4 py-3 lg:py-3.5 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1db954] focus:bg-[#2a2a2a] placeholder-[#a7a7a7] transition-all font-normal hover:bg-[#2a2a2a]"
            />
          </div>
        </div>

        {/* Right Section - Notifications and Profile */}
        <div className="flex items-center gap-3 lg:gap-4" ref={settingsRef}>
          {/* Notification Bell */}
          <button className="hidden sm:flex items-center justify-center w-9 h-9 text-[#b3b3b3] hover:text-white hover:bg-[#282828] rounded-full transition-all">
            <FaBell className="text-sm" />
          </button>

          {/* Profile Dropdown */}
          <div 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="flex items-center gap-2 lg:gap-3 bg-[#0d0d0d] hover:bg-[#1a1a1a] px-2 lg:px-3 py-1.5 lg:py-2 rounded-full cursor-pointer transition-all shrink-0 border border-transparent hover:border-[#282828]"
          >
            <img
              src={getUserAvatar()}
              alt={getUserName()}
              className="w-7 h-7 lg:w-8 lg:h-8 rounded-full ring-2 ring-[#1db954] object-cover"
            />
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-white font-semibold text-xs lg:text-sm max-w-[120px] truncate leading-tight">{getUserName()}</span>
                <span className="text-[#b3b3b3] text-[10px] lg:text-xs leading-tight">{user?.role === 'artist' ? 'Artist' : 'Premium'}</span>
              </div>
              <FaChevronDown className="text-[#b3b3b3] text-xs" />
            </div>
          </div>
        </div>
      </nav>

      {/* Settings Modal */}
      {isSettingsOpen && <SettingsModal />}
    </>
  );
};

export default Navbar;
