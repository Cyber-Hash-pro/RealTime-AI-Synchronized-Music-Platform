import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useMusicPlayer } from '../contexts/MusicContext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMusicData, specificMusicData } from '../Store/actions/musicaction.jsx';
import {
  SongHeader,
  SongControls,
  SongInfo,
  NextSongs,
  LoadingState,
  ErrorState
} from '../components/SongDetails';


const SongDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const { currentMusic: songData, allMusic } = useSelector((state) => state.music);
  console.log('fetch songs data ',songData)

  const {
    currentSong,
    isPlaying,
    duration,
    playSong,
    togglePlayPause,
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

  // Fetch song on component mount
  useEffect(() => {
    fetchSong();
    fetchAllSongs();
    return () => {
      fetchSong();
      fetchAllSongs();
    }
  }, [id]);

  // Auto-play when song data loads
  useEffect(() => {
    if (songData && allSongs.length > 0) {
      const fullPlaylist = [songData, ...allSongs];
      playSong(songData, fullPlaylist);
    }
  }, [songData?._id, allSongs.length]);

  // Event handlers
  const handlePlayPause = () => {
    if (isCurrentSong) {
      togglePlayPause();
    } else {
      playSong(songData);
    }
  };

  const handleLike = () => setIsLiked(!isLiked);
  const handleGoBack = () => navigate(-1);

  // Loading state
  if (loading) return <LoadingState />;

  // Error state
  if (error || !songData) return <ErrorState error={error} onGoBack={handleGoBack} />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a5c3c] via-[#121212] to-[#121212]">
      {/* Header with back button */}
      <div className="p-4 sm:p-6">
        <button 
          onClick={handleGoBack}
          className="flex items-center gap-2 text-white hover:text-[#1db954] transition-colors mb-6"
        >
          <FaArrowLeft className="text-xl" />
          <span className="text-lg font-medium">Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 pb-32">
        <SongHeader 
          songData={songData}
          isCurrentSong={isCurrentSong}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
        />

        <SongControls 
          isCurrentSong={isCurrentSong}
          isPlaying={isPlaying}
          isLiked={isLiked}
          onPlayPause={handlePlayPause}
          onLike={handleLike}
        />

        <SongInfo 
          songData={songData}
          isCurrentSong={isCurrentSong}
          duration={duration}
          formatTime={formatTime}
        />

        <NextSongs allSongs={allSongs} />
      </div>
    </div>
  );
};

export default SongDetails;
    