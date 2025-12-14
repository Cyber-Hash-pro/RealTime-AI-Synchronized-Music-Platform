import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlay, FaArrowLeft, FaMusic, FaHeart, FaEllipsisH, FaClock, FaRandom } from 'react-icons/fa';
import { useMusicPlayer } from '../contexts/MusicContext';
import { MUSIC_API } from '../config/api';

const UserPlaylist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playSong } = useMusicPlayer();
  
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${MUSIC_API}/playlist/user/${id}`, {
          withCredentials: true,
        });
        
        const data = res.data;
        console.log("User Playlist:", data);
        
        if (data?.playlists) {
          setPlaylist(data.playlists);
          // Songs are already populated in musics array
          setSongs(data.playlists.musics || []);
        }
      } catch (err) {
        console.error("Error fetching user playlist:", err);
        setError("Failed to load playlist");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlaylist();
  }, [id]);

  const handlePlaySong = (index) => {
    if (songs.length > 0) {
      setPlayingIndex(index);
      playSong(songs[index], songs);
    }
  };

  const handlePlayAll = () => {
    if (songs.length > 0) {
      setPlayingIndex(0);
      playSong(songs[0], songs);
    }
  };

  const handleShuffle = () => {
    if (songs.length > 0) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setPlayingIndex(randomIndex);
      const shuffledSongs = [...songs].sort(() => Math.random() - 0.5);
      playSong(shuffledSongs[0], shuffledSongs);
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return '3:00';
    if (typeof duration === 'string' && duration.includes(':')) return duration;
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#121212]">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-[#1db954] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-white text-xl font-medium">Loading your playlist...</p>
          <p className="text-[#b3b3b3] mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#121212]">
        <div className="text-center">
          <div className="text-6xl mb-6">😕</div>
          <p className="text-red-400 text-2xl mb-4">{error || 'Playlist not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#1db954] text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const playlistCover = songs[0]?.coverUrl || 'https://placehold.co/300x300/1db954/ffffff?text=🎵';
  const totalDuration = songs.length * 3; // Approximate 3 min per song

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header Background Gradient */}
      <div
        className="relative"
        style={{
          background: `linear-gradient(180deg, rgba(29, 185, 84, 0.6) 0%, rgba(29, 185, 84, 0.2) 50%, #121212 100%)`
        }}
      >
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-black/40 hover:bg-black/60 text-white px-4 py-2 rounded-full transition-colors backdrop-blur-sm"
          >
            <FaArrowLeft />
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* Playlist Header */}
        <div className="pt-20 pb-8 px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 max-w-6xl mx-auto">
            {/* Playlist Cover */}
            <div className="relative group">
              <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-lg shadow-2xl overflow-hidden">
                {songs.length > 0 ? (
                  <div className="grid grid-cols-2 w-full h-full">
                    {songs.slice(0, 4).map((song, idx) => (
                      <img
                        key={idx}
                        src={song?.coverUrl || 'https://placehold.co/150x150/282828/b3b3b3?text=🎵'}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ))}
                    {songs.length < 4 && Array(4 - songs.length).fill(0).map((_, idx) => (
                      <div key={`placeholder-${idx}`} className="w-full h-full bg-[#282828] flex items-center justify-center">
                        <FaMusic className="text-[#b3b3b3] text-2xl" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1db954] to-[#191414] flex items-center justify-center">
                    <FaMusic className="text-white text-6xl" />
                  </div>
                )}
              </div>
              
              {/* Play Overlay */}
              <div 
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer rounded-lg"
                onClick={handlePlayAll}
              >
                <div className="w-16 h-16 bg-[#1db954] rounded-full flex items-center justify-center shadow-lg">
                  <FaPlay className="text-black text-2xl ml-1" />
                </div>
              </div>
            </div>

            {/* Playlist Info */}
            <div className="text-center sm:text-left flex-1">
              <p className="text-white/80 text-sm font-medium uppercase tracking-wider mb-2">
                Playlist
              </p>
              <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                {playlist.title}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-white/80">
                <span className="font-medium">{songs.length} songs</span>
                <span>•</span>
                <span>about {totalDuration} min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 sm:px-8 py-6 bg-gradient-to-b from-[#121212]/80 to-[#121212]">
        <div className="flex items-center gap-4 max-w-6xl mx-auto">
          <button
            onClick={handlePlayAll}
            disabled={songs.length === 0}
            className="w-14 h-14 bg-[#1db954] rounded-full flex items-center justify-center hover:scale-105 hover:bg-[#1ed760] transition-all shadow-lg shadow-[#1db954]/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPlay className="text-black text-xl ml-1" />
          </button>
          
          <button
            onClick={handleShuffle}
            disabled={songs.length === 0}
            className="w-12 h-12 bg-transparent border border-[#b3b3b3]/30 rounded-full flex items-center justify-center hover:border-white hover:scale-105 transition-all disabled:opacity-50"
          >
            <FaRandom className="text-[#b3b3b3] hover:text-white" />
          </button>
          
          <button className="w-12 h-12 bg-transparent border border-[#b3b3b3]/30 rounded-full flex items-center justify-center hover:border-white hover:scale-105 transition-all">
            <FaHeart className="text-[#b3b3b3] hover:text-[#1db954]" />
          </button>
          
          <button className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center hover:scale-105 transition-all">
            <FaEllipsisH className="text-[#b3b3b3] hover:text-white" />
          </button>
        </div>
      </div>

      {/* Songs List */}
      <div className="px-6 sm:px-8 pb-32 max-w-6xl mx-auto">
        {songs.length > 0 ? (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-[40px_1fr_1fr_80px] gap-4 px-4 py-3 text-[#b3b3b3] text-sm font-medium border-b border-[#282828] mb-2">
              <div className="text-center">#</div>
              <div>TITLE</div>
              <div className="hidden sm:block">ARTIST</div>
              <div className="text-right flex items-center justify-end">
                <FaClock className="text-xs" />
              </div>
            </div>

            {/* Song Rows */}
            <div className="space-y-1">
              {songs.map((song, index) => (
                <div
                  key={song?._id || index}
                  onClick={() => handlePlaySong(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`grid grid-cols-[40px_1fr_1fr_80px] gap-4 px-4 py-3 rounded-md cursor-pointer transition-all ${
                    playingIndex === index 
                      ? 'bg-[#1db954]/20' 
                      : 'hover:bg-[#282828]'
                  }`}
                >
                  {/* Track Number / Play Icon */}
                  <div className="flex items-center justify-center">
                    {hoveredIndex === index || playingIndex === index ? (
                      <FaPlay className={`text-sm ${playingIndex === index ? 'text-[#1db954]' : 'text-white'}`} />
                    ) : (
                      <span className="text-[#b3b3b3]">{index + 1}</span>
                    )}
                  </div>

                  {/* Song Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={song?.coverUrl || 'https://placehold.co/48x48/282828/b3b3b3?text=🎵'}
                      alt={song?.title}
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className={`font-medium truncate ${playingIndex === index ? 'text-[#1db954]' : 'text-white'}`}>
                        {song?.title || 'Unknown Title'}
                      </p>
                      <p className="text-[#b3b3b3] text-sm truncate sm:hidden">
                        {song?.artist || 'Unknown Artist'}
                      </p>
                    </div>
                  </div>

                  {/* Artist */}
                  <div className="hidden sm:flex items-center">
                    <span className="text-[#b3b3b3] truncate hover:text-white hover:underline cursor-pointer">
                      {song?.artist || 'Unknown Artist'}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center justify-end text-[#b3b3b3]">
                    {formatDuration(song?.duration)}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#282828] flex items-center justify-center">
              <FaMusic className="text-4xl text-[#b3b3b3]" />
            </div>
            <h3 className="text-white text-2xl font-bold mb-2">This playlist is empty</h3>
            <p className="text-[#b3b3b3] mb-6">Add some songs to get started</p>
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

export default UserPlaylist;