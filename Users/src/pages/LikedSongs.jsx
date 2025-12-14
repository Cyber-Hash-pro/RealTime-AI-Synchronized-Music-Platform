import { useEffect, useState } from 'react';
import { FaHeart, FaPlay, FaMusic } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMusicPlayer } from '../contexts/MusicContext';
import { MUSIC_API } from '../config/api';

const LikedSongs = () => {
  const navigate = useNavigate();
  const { playSong } = useMusicPlayer();
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    fetchLikedSongs();
  }, []);

  const fetchLikedSongs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${MUSIC_API}/all/likedSongs`, {
        withCredentials: true
      });
      
      // Extract song data from the populated songId
      const songs = data.likedSongs?.map(item => item.songId).filter(song => song) || [];
      setLikedSongs(songs);
    } catch (err) {
      console.error('Error fetching liked songs:', err);
      setError('Failed to load liked songs');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAll = () => {
    if (likedSongs.length > 0) {
      playSong(likedSongs[0], likedSongs);
    }
  };

  const handlePlaySong = (song, index) => {
    playSong(song, likedSongs);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1db954] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your liked songs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-b from-purple-700 via-purple-900 to-[#121212] px-4 sm:px-8 pt-8 pb-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 max-w-6xl mx-auto">
          {/* Liked Songs Icon */}
          <div className="w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-br from-purple-400 to-purple-700 rounded-lg flex items-center justify-center shadow-2xl">
            <FaHeart className="text-white text-7xl drop-shadow-lg" />
          </div>
          
          {/* Playlist Info */}
          <div className="text-center sm:text-left flex-1">
            <p className="text-sm font-medium text-white/70 uppercase tracking-wider mb-2">
              Playlist
            </p>
            <h1 className="text-5xl sm:text-7xl font-bold text-white mb-4 drop-shadow-lg">
              Liked Songs
            </h1>
            <p className="text-white/80 text-lg">
              {likedSongs.length} song{likedSongs.length !== 1 ? 's' : ''} you love
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 sm:px-8 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePlayAll}
            disabled={likedSongs.length === 0}
            className="w-14 h-14 bg-[#d36582] rounded-full flex items-center justify-center hover:scale-105 hover:bg-[#1ed760] transition-all shadow-lg shadow-[#1db954]/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPlay className="text-black text-xl ml-1" />
          </button>
        </div>
      </div>

      {/* Songs List */}
      <div className="px-4 sm:px-8 pb-32 max-w-6xl mx-auto">
        {likedSongs.length > 0 ? (
          <div className="space-y-1">
            {likedSongs.map((song, index) => (
              <div
                key={song._id}
                onClick={() => handlePlaySong(song, index)}
                onMouseEnter={() => setHoveredId(song._id)}
                onMouseLeave={() => setHoveredId(null)}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#282828] transition-colors cursor-pointer group"
              >
                {/* Track Number / Play Icon */}
                <div className="w-8 text-center flex-shrink-0">
                  {hoveredId === song._id ? (
                    <FaPlay className="text-white text-sm mx-auto" />
                  ) : (
                    <span className="text-[#b3b3b3]">{index + 1}</span>
                  )}
                </div>

                {/* Album Art */}
                <div className="w-12 h-12 flex-shrink-0">
                  {song.coverUrl ? (
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#282828] rounded flex items-center justify-center">
                      <FaMusic className="text-[#b3b3b3]" />
                    </div>
                  )}
                </div>

                {/* Song Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{song.title}</p>
                  <p className="text-[#b3b3b3] text-sm truncate">{song.artist}</p>
                </div>

                {/* Liked Icon */}
                <FaHeart className="text-[#1db954] flex-shrink-0" />

                {/* Duration */}
                <span className="text-[#b3b3b3] text-sm w-12 text-right flex-shrink-0">
                  {song.duration || '3:00'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#282828] flex items-center justify-center">
              <FaHeart className="text-4xl text-[#b3b3b3]" />
            </div>
            <h3 className="text-white text-2xl font-bold mb-2">Songs you like will appear here</h3>
            <p className="text-[#b3b3b3] text-lg mb-6">
              Save songs by tapping the heart icon
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#1db954] text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform"
            >
              Browse Songs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedSongs;