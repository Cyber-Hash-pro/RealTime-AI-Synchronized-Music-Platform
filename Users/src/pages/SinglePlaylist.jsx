import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaPlay, FaArrowLeft } from 'react-icons/fa';
import SongTableRow from '../components/SongTableRow';
import { fetchSinglePlaylist } from '../Store/actions/musicaction.jsx';
import { useMusicPlayer } from '../contexts/MusicContext';

const SinglePlaylist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playSong } = useMusicPlayer();
  
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        setLoading(true);
        const data = await fetchSinglePlaylist(id);
        console.log("Fetched playlist:", data);
        setPlaylist(data);
        setError(null);
      } catch (err) {
        console.error("Error loading playlist:", err);
        setError("Failed to load playlist");
      } finally {
        setLoading(false);
      }
    };

    loadPlaylist();
  }, [id]);

  const handlePlaySong = (index) => {
    if (playlist?.songs && playlist.songs.length > 0) {
      playSong(playlist.songs[index], playlist.songs);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1db954] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading playlist...</p>
        </div>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error || 'Playlist not found'}</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-[#1db954] text-white px-6 py-3 rounded-full hover:bg-[#1ed760] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const playlistSongs = playlist.songs || playlist.musics || [];
  const playlistCover = playlist.coverUrl || playlist.cover || (playlistSongs[0]?.coverUrl) || 'https://placehold.co/300x300/1db954/ffffff?text=Playlist';

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="p-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-[#1db954] transition-colors"
        >
          <FaArrowLeft className="text-xl" />
          <span className="text-lg font-medium">Back</span>
        </button>
      </div>

      {/* Playlist Banner */}
      <div
        className="relative min-h-72 sm:h-80 flex items-end p-6 sm:p-8"
        style={{
          background: `linear-gradient(180deg, rgba(29, 185, 84, 0.4) 0%, #121212 100%),
                      url(${playlistCover}) center/cover`
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end items-center gap-4 sm:gap-6 text-center sm:text-left w-full">
          <img
            src={playlistCover}
            alt={playlist.name || playlist.title}
            className="w-40 h-40 sm:w-52 sm:h-52 rounded-lg shadow-2xl object-cover"
            onError={(e) => {
              e.target.src = 'https://placehold.co/300x300/1db954/ffffff?text=Playlist';
            }}
          />
          <div>
            <p className="text-sm font-semibold text-white mb-2">PLAYLIST</p>
            <h1 className="text-5xl font-bold text-white mb-4">{playlist.title || playlist.name}</h1>
            <div className="flex items-center gap-2 text-white">
              <span className="font-semibold">{playlist.artist || playlist.creator || 'Unknown'}</span>
              <span>•</span>
              <span>{playlistSongs.length} songs</span>
            </div>
            {playlist.description && (
              <p className="text-[#b3b3b3] mt-2">{playlist.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Play Button */}
      <div className="px-4 sm:px-8 py-6">
        <button 
          // onClick={handlePlayAll}
          disabled={playlistSongs.length === 0}
          className="bg-[#1db954] text-black p-4 rounded-full hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaPlay className="text-2xl ml-1" />
        </button>
      </div>

      {/* Songs Table */}
      <div className="px-4 sm:px-8 pb-6 overflow-x-auto">
        {playlistSongs.length > 0 ? (
          <table className="w-full min-w-[600px]">
            <thead className="border-b border-[#282828]">
              <tr className="text-left text-[#b3b3b3] text-sm">
                <th className="pb-3 px-4 font-normal">#</th>
                <th className="pb-3 px-4 font-normal">TITLE</th>
                <th className="pb-3 px-4 font-normal">ARTIST</th>
                <th className="pb-3 px-4 font-normal text-right">DURATION</th>
              </tr>
            </thead>
            <tbody>
              {playlistSongs.map((song, index) => (
                <SongTableRow 
                  key={song._id || song.id || index} 
                  song={song} 
                  index={index}  
                  onClick={() => handlePlaySong(index)} 
                />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#b3b3b3] text-lg">No songs in this playlist</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePlaylist;
