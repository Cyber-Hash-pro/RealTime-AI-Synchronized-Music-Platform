import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaPlay, FaMusic } from 'react-icons/fa';
import axios from 'axios';
import { useMusicPlayer } from '../contexts/MusicContext';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { playSong } = useMusicPlayer();
  
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    if (query) {
      searchMusic(query);
    }
  }, [query]);

  const searchMusic = async (searchQuery) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:3001/api/music/search/${encodeURIComponent(searchQuery)}`, {
        withCredentials: true
      });
      setSearchResults(data.musics || []);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySong = (song, e) => {
    e?.stopPropagation();
    playSong(song, searchResults);
  };

  const handleSongClick = (songId) => {
    navigate(`/song/${songId}`);
  };

  const formatDuration = (duration) => {
    if (!duration) return '3:00';
    if (typeof duration === 'string' && duration.includes(':')) return duration;
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!query) {
    return (
      <div className="px-6 py-8">
        <div className="text-center py-20">
          <FaMusic className="text-6xl text-[#b3b3b3] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Search for music</h2>
          <p className="text-[#b3b3b3]">Find your favorite songs, artists, and more</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="px-6 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-[#1db954] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const topResult = searchResults[0];
  const otherSongs = searchResults.slice(0, 4);

  return (
    <div className="px-6 py-8 pb-32">
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Result Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Top result</h2>
            {topResult && (
              <div
                onClick={() => handleSongClick(topResult._id)}
                onMouseEnter={() => setHoveredId('top')}
                onMouseLeave={() => setHoveredId(null)}
                className="bg-[#181818] hover:bg-[#282828] rounded-lg p-5 cursor-pointer transition-all duration-300 group relative"
              >
                {/* Album Art */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden shadow-lg mb-5">
                  {topResult.coverUrl ? (
                    <img
                      src={topResult.coverUrl}
                      alt={topResult.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#282828] flex items-center justify-center">
                      <FaMusic className="text-4xl text-[#b3b3b3]" />
                    </div>
                  )}
                </div>

                {/* Song Title */}
                <h3 className="text-3xl font-bold text-white mb-2 truncate">
                  {topResult.title}
                </h3>

                {/* Song Info */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="bg-[#121212] text-white px-2 py-1 rounded-full text-xs font-medium">
                    Song
                  </span>
                  <span className="text-[#b3b3b3]">•</span>
                  <span className="text-[#b3b3b3]">{topResult.artist}</span>
                </div>

                {/* Play Button */}
                <button
                  onClick={(e) => handlePlaySong(topResult, e)}
                  className={`absolute bottom-5 right-5 w-12 h-12 bg-[#1db954] rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#1ed760] ${
                    hoveredId === 'top' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <FaPlay className="text-black text-lg ml-1" />
                </button>
              </div>
            )}
          </div>

          {/* Songs Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Songs</h2>
            <div className="space-y-2">
              {otherSongs.map((song) => (
                <div
                  key={song._id}
                  onClick={() => handleSongClick(song._id)}
                  onMouseEnter={() => setHoveredId(song._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-[#282828] cursor-pointer transition-colors group"
                >
                  {/* Album Art */}
                  <div className="relative w-10 h-10 flex-shrink-0">
                    {song.coverUrl ? (
                      <img
                        src={song.coverUrl}
                        alt={song.title}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#282828] rounded flex items-center justify-center">
                        <FaMusic className="text-[#b3b3b3] text-xs" />
                      </div>
                    )}
                    
                    {/* Play overlay */}
                    {hoveredId === song._id && (
                      <div 
                        onClick={(e) => handlePlaySong(song, e)}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center rounded"
                      >
                        <FaPlay className="text-white text-xs" />
                      </div>
                    )}
                  </div>

                  {/* Song Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate hover:underline">
                      {song.title}
                    </p>
                    <p className="text-[#b3b3b3] text-sm truncate">
                      {song.artist}
                    </p>
                  </div>

                  {/* Duration */}
                  <span className="text-[#b3b3b3] text-sm">
                    {formatDuration(song.duration)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <FaMusic className="text-6xl text-[#b3b3b3] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No results found for "{query}"</h2>
          <p className="text-[#b3b3b3]">Please check your spelling or try different keywords</p>
        </div>
      )}

      {/* All Results Section */}
      {searchResults.length > 4 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-white mb-4">All Results</h2>
          <div className="space-y-1">
            {searchResults.slice(4).map((song, index) => (
              <div
                key={song._id}
                onClick={() => handleSongClick(song._id)}
                onMouseEnter={() => setHoveredId(song._id)}
                onMouseLeave={() => setHoveredId(null)}
                className="flex items-center gap-4 p-3 rounded-md hover:bg-[#282828] cursor-pointer transition-colors group"
              >
                {/* Track Number */}
                <div className="w-6 text-center">
                  {hoveredId === song._id ? (
                    <FaPlay 
                      onClick={(e) => handlePlaySong(song, e)}
                      className="text-white text-sm mx-auto" 
                    />
                  ) : (
                    <span className="text-[#b3b3b3]">{index + 5}</span>
                  )}
                </div>

                {/* Album Art */}
                <div className="w-10 h-10 flex-shrink-0">
                  {song.coverUrl ? (
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#282828] rounded flex items-center justify-center">
                      <FaMusic className="text-[#b3b3b3] text-xs" />
                    </div>
                  )}
                </div>

                {/* Song Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {song.title}
                  </p>
                  <p className="text-[#b3b3b3] text-sm truncate">
                    {song.artist}
                  </p>
                </div>

                {/* Duration */}
                <span className="text-[#b3b3b3] text-sm">
                  {formatDuration(song.duration)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
