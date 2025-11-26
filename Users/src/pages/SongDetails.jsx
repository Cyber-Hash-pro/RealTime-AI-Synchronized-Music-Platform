import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlay, FaPause, FaHeart, FaShare, FaArrowLeft, FaVolumeUp, FaRandom, FaRedo } from 'react-icons/fa';
import { useMusicPlayer } from '../contexts/MusicContext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMusicData, specificMusicData } from '../Store/actions/musicaction.jsx';
import SongCard from '../components/SongCard';




const SongDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [songData ,songsetdata]=useState()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dispatch(specificMusicData(id));
        songsetdata(result);
      } catch (error) {
        console.error('Error fetching song data:', error);
      }
    };
    fetchData();
  }, [id, dispatch]);
  // Redux state
  const { currentMusic, allMusic } = useSelector((state) => state.music);
  console.log("----------------------------->", songData, allMusic);

  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    playSong,
    togglePlayPause,
    setVolumeLevel,
    formatTime
  } = useMusicPlayer();

  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter all songs to get recommendations (excluding current song)
  const allSongs = allMusic ? allMusic.filter(song => song._id !== id).slice(0, 6) : [];

  // Check if this song is currently playing
  const isCurrentSong = currentSong && currentSong._id === songData?._id;

  // Fetch song data using Redux
  const fetchSong = async () => {
    try {
      setLoading(true);
      await dispatch(specificMusicData(id));
      setError(null);
    } catch (error) {
      console.error('Error fetching song:', error);
      setError('Failed to load song details');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all songs for recommendations using Redux
  const fetchAllSongs = async () => {
    try {
      await dispatch(fetchMusicData());
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  // Auto-play when song data loads
  useEffect(() => {
    if (songData && allSongs.length > 0) {
      // Create playlist with current song and all other songs
      const fullPlaylist = [songData, ...allSongs];
      playSong(songData, fullPlaylist);
    }
  }, [songData, allSongs.length]);

  // Fetch song on component mount
  useEffect(() => {
    fetchSong();
    fetchAllSongs();
  }, [id, dispatch]);

  // Audio event handlers
  const handlePlayPause = () => {
    if (isCurrentSong) {
      togglePlayPause();
    } else {
      playSong(songData);
      // isPlaying(false)
    }
  };


  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const getProgressPercentage = () => {
    return isCurrentSong && duration ? (currentTime / duration) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1db954] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading song...</p>
        </div>
      </div>
    );
  }

  if (error || !songData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#121212] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error || 'Song not found'}</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a5c3c] via-[#121212] to-[#121212]">
      {/* Header with back button */}
      <div className="p-4 sm:p-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-[#1db954] transition-colors mb-6"
        >
          <FaArrowLeft className="text-xl" />
          <span className="text-lg font-medium">Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 pb-32">
        {/* Song Info Section */}
        <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8 mb-8">
          <div className="relative group">
            <img
              src={songData.coverUrl}
              alt={songData.title}
              className="w-64 h-64 sm:w-80 sm:h-80 rounded-lg shadow-2xl object-cover"
              onError={(e) => {
                e.target.src = 'https://placehold.co/300x300/1db954/ffffff?text=Music';
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <button 
                onClick={handlePlayPause}
                className="bg-[#1db954] text-black p-6 rounded-full hover:scale-110 transition-transform shadow-xl"
              >
                {isCurrentSong && isPlaying ? <FaPause className="text-2xl" /> : <FaPlay className="text-2xl ml-1" />}
              </button>
            </div>
          </div>

          <div className="text-center lg:text-left flex-1">
            <p className="text-sm font-semibold text-white/80 uppercase tracking-wide mb-2">Song</p>
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-white leading-tight mb-4">
              {songData.title}
            </h1>
            <div className="flex items-center justify-center lg:justify-start gap-2 text-white text-lg sm:text-xl mb-6">
              <span className="font-semibold">{songData.artist}</span>
              <span>•</span>
              <span>{new Date(songData.createdAt).getFullYear()}</span>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <button 
            onClick={handlePlayPause}
            className="bg-[#1db954] text-black px-8 py-4 rounded-full font-bold hover:scale-105 hover:bg-[#1ed760] transition-all flex items-center gap-3 text-lg shadow-xl"
          >
            {isCurrentSong && isPlaying ? <FaPause className="text-xl" /> : <FaPlay className="text-xl" />}
            <span>{isCurrentSong && isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          
          <button 
            onClick={handleLike}
            className={`p-4 rounded-full border-2 transition-all ${
              isLiked 
                ? 'bg-[#1db954] border-[#1db954] text-black' 
                : 'border-[#7f7f7f] text-white hover:border-white hover:scale-105'
            }`}
          >
            <FaHeart className="text-xl" />
          </button>
          
          <button className="p-4 rounded-full border-2 border-[#7f7f7f] text-white hover:border-white hover:scale-105 transition-all">
            <FaShare className="text-xl" />
          </button>
          
          <button className="p-4 rounded-full border-2 border-[#7f7f7f] text-white hover:border-white hover:scale-105 transition-all">
            <FaRandom className="text-xl" />
          </button>
          
          <button className="p-4 rounded-full border-2 border-[#7f7f7f] text-white hover:border-white hover:scale-105 transition-all">
            <FaRedo className="text-xl" />
          </button>
        </div>

        {/* Progress Bar and Controls - Only show if this song is currently playing */}

        {/* Song Info */}
        <div className="bg-[#181818] rounded-lg p-6 mb-8">
          <h3 className="text-white text-xl font-bold mb-4">About this song</h3>
          <div className="space-y-3 text-[#b3b3b3]">
            <p><span className="text-white font-medium">Artist:</span> {songData.artist}</p>
            <p><span className="text-white font-medium">Release Date:</span> {new Date(songData.createdAt).toLocaleDateString()}</p>
            <p><span className="text-white font-medium">Duration:</span> {isCurrentSong ? formatTime(duration) : 'Unknown'}</p>
            <p><span className="text-white font-medium">File Format:</span> MP3</p>
          </div>
        </div>

        {/* Next Songs Section */}
        <div className="mb-8">
          <h2 className="text-white text-2xl font-bold mb-6">Next Songs</h2>
          
          {allSongs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allSongs.map((song) => (
                <SongCard key={song._id} song={song} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[#b3b3b3] text-lg">No more songs available</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SongDetails;
        // <div className="mb-8">
        //   <h2 className="text-white text-2xl font-bold mb-6">Next Songs</h2>
          
        //   {songsLoading ? (
        //     <div className="flex items-center justify-center py-8">
        //       <div className="w-8 h-8 border-2 border-[#1db954] border-t-transparent rounded-full animate-spin"></div>
        //       <span className="text-white ml-3">Loading songs...</span>
        //     </div>
        //   ) : allSongs.length > 0 ? (
        //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        //       {allSongs.map((song) => (
        //         <SongCard key={song._id} song={song} />
        //       ))}
        //     </div>
        //   ) : (
        //     <div className="text-center py-8">
        //       <p className="text-[#b3b3b3] text-lg">No more songs available</p>
        //     </div>
        //   )}
        // </div>
