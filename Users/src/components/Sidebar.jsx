import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaList, FaPlus, FaSignOutAlt, FaHeart } from 'react-icons/fa';
import { MdLibraryMusic } from 'react-icons/md';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    { path: '/liked-songs', label: 'Liked Songs', icon: <FaHeart /> },
    { path: '/artist-playlists', label: 'Artist Playlists', icon: <MdLibraryMusic /> },
  ];

  const libraryItems = [
    { path: '/my-playlists', label: 'My Playlists', icon: <FaList /> },
    { path: '/create-playlist', label: 'Create Playlist', icon: <FaPlus /> },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // In real app: clear auth tokens, user data, etc.
      alert('Logged out successfully! (Dummy action)');
      navigate('/login');
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static
        w-[250px] min-w-[250px] shrink-0 
        bg-black h-screen flex flex-col 
        overflow-y-auto z-50
        transition-transform duration-300 ease-in-out
        border-r border-[#282828]
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="px-6 pt-6 pb-4">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-9 h-9 bg-[#1db954] rounded-full flex items-center justify-center text-black text-lg font-bold shrink-0">
              M
            </span>
            <span className="tracking-tight">
              Musi<span className="text-[#1db954]">fy</span>
            </span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#282828] text-white border-l-4 border-[#1db954] pl-3' 
                      : 'text-[#b3b3b3] hover:text-white hover:bg-[#181818]'
                  }`
                }
              >
                <span className="text-[18px] min-w-5 flex items-center justify-center shrink-0">{item.icon}</span>
                <span className="font-medium text-[15px] leading-none">{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-[#282828] my-5"></div>

          {/* Library Section */}
          <div className="space-y-1">
            {libraryItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#282828] text-white border-l-4 border-[#1db954] pl-3' 
                      : 'text-[#b3b3b3] hover:text-white hover:bg-[#181818]'
                  }`
                }
              >
                <span className="text-[18px] min-w-5 flex items-center justify-center shrink-0">{item.icon}</span>
                <span className="font-medium text-[15px] leading-none">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="px-3 pb-4 pt-2 border-t border-[#282828] mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-[#b3b3b3] hover:text-red-400 hover:bg-[#181818] transition-all duration-200"
          >
            <FaSignOutAlt size={18} className="min-w-5 shrink-0" />
            <span className="font-medium text-[15px] leading-none">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
