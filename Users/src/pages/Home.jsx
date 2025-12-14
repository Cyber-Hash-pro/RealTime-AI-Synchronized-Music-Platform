import { useEffect, useState } from 'react';
import SongCard from '../components/SongCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMusicData } from '../Store/actions/musicaction.jsx';
import { useNavigate } from 'react-router-dom';
import socketInstance from '../socket.service.js';
import { FaPlus, FaTimes, FaSmile, FaMusic, FaHeart, FaBroadcastTower } from 'react-icons/fa';

const Home = () => {

  const dispatch = useDispatch();
  const { allMusic, loading, error } = useSelector((state) => state.music);
  const navigate = useNavigate();
  const [fabOpen, setFabOpen] = useState(false);
  
  useEffect(() => {
    dispatch(fetchMusicData());
    socketInstance.on('connect', () => {
        console.log('Connected to socket server');
    });
    socketInstance.on('play', (data) => {
      console.log('Play event received with data:', data);
      const musicId = data.musicId; 
    
      navigate(`/song/${musicId}`
        
      );
    });
   
    return () => {
      socketInstance.off('connect');
    };

  }, [dispatch]);

  const handleMoodDetection = () => {
    setFabOpen(false);
    navigate('/mood-detector');
  };

  if (loading) {
    return (
      <div className="px-4 py-6 sm:p-6">
        <h1 className="text-4xl font-bold text-white mb-8">All Songs</h1>
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-[#1db954] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading songs...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6 sm:p-6">
        <h1 className="text-4xl font-bold text-white mb-8">All Songs</h1>
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-red-400 text-lg mb-4">{error}</div>
          <button
            onClick={() => dispatch(fetchMusicData())}
            className="bg-[#1db954] text-black px-6 py-2 rounded-full hover:bg-[#1ed760] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:p-6 relative">
      <h1 className="text-4xl font-bold text-white mb-8">All Songs</h1>

      {(!allMusic || allMusic.length === 0) ? (
        <div className="text-center text-[#b3b3b3] py-8">
          No songs available
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6">
          {allMusic.map((song) => (
            <SongCard key={song._id} song={song} />
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-35 right-5 z-50">
        {/* Background Blur when open */}
        {fabOpen && (
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setFabOpen(false)}
          />
        )}

        {/* FAB Menu Items */}
        <div className={`absolute bottom-16 right-0 z-50 flex flex-col gap-3 transition-all duration-300 ${fabOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          {/* Mood Detection Button */}
          <button
            onClick={handleMoodDetection}
            className="group flex items-center flex-row-reverse gap-3 transition-all duration-300"
            style={{
              transitionDelay: fabOpen ? '100ms' : '0ms'
            }}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 hover:scale-110 transition-transform">
              <FaSmile className="text-white text-xl" />
            </div>
            <span className="bg-[#282828] text-white px-3 py-1.5 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Mood Detection 🎭
            </span>
          </button>

          {/* Live Sessions Button */}
          <button
            onClick={() => { setFabOpen(false); navigate('/join-friends'); }}
            className="group flex items-center flex-row-reverse gap-3 transition-all duration-300"
            style={{
              transitionDelay: fabOpen ? '150ms' : '0ms'
            }}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-110 transition-transform">
              <FaBroadcastTower className="text-white text-xl" />
            </div>
            <span className="bg-[#282828] text-white px-3 py-1.5 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Live Sessions 🎧
            </span>
          </button>

          {/* Liked Songs Button */}
          <button
            onClick={() => { setFabOpen(false); navigate('/liked-songs'); }}
            className="group flex items-center flex-row-reverse gap-3 transition-all duration-300"
            style={{
              transitionDelay: fabOpen ? '200ms' : '0ms'
            }}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/30 hover:scale-110 transition-transform">
              <FaHeart className="text-white text-xl" />
            </div>
            <span className="bg-[#282828] text-white px-3 py-1.5 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Liked Songs ❤️
            </span>
          </button>
        </div>

        {/* Main FAB Button */}
        <button
          onClick={() => setFabOpen(!fabOpen)}
          className={`relative z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
            fabOpen 
              ? 'bg-[#282828] rotate-45 scale-90' 
              : 'bg-gradient-to-r from-[#1db954] to-[#1ed760] hover:scale-110 hover:shadow-[#1db954]/40'
          }`}
          style={{
            boxShadow: fabOpen ? 'none' : '0 8px 25px rgba(29, 185, 84, 0.4)'
          }}
        >
          {fabOpen ? (
            <FaTimes className="text-white text-xl transition-transform" />
          ) : (
            <FaPlus className="text-black text-xl transition-transform" />
          )}
          
          {/* Ripple Effect */}
          {!fabOpen && (
            <span className="absolute inset-0 rounded-full bg-[#1db954] animate-ping opacity-20" />
          )}
        </button>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default Home;
