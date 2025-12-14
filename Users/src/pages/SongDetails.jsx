import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import socketInstance from '../socket.service.js';
import axios from 'axios';
import { MUSIC_API } from '../config/api';


const SongDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const { currentMusic: songData, allMusic } = useSelector((state) => state.music);

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
  
  // Refs to prevent multiple calls
  const hasPlayedRef = useRef(false);
  const lastPlayedIdRef = useRef(null);

  // Filter all songs to get recommendations (excluding current song)
  const allSongs = allMusic ? allMusic.filter(song => song._id !== id).slice(0, 6) : [];

  // Check if this song is currently playing
  const isCurrentSong = currentSong && currentSong._id === songData?._id;

  // Check if song is already liked
  const checkIfLiked = useCallback(async () => {
    try {
      const { data } = await axios.get(`${MUSIC_API}/all/likedSongs`, {
        withCredentials: true
      });
      const likedSongIds = data.likedSongs?.map(item => item.songId?._id) || [];
      setIsLiked(likedSongIds.includes(id));
    } catch (err) {
      console.error('Error checking liked status:', err);
    }
  }, [id]);

  // Fetch song data using Redux
  const fetchSong = useCallback(async () => {
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
  }, [dispatch, id]);

  // Fetch all songs for recommendations using Redux
  const fetchAllSongs = useCallback(async () => {
    try {
      await dispatch(fetchMusicData());
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  }, [dispatch]);

  // Fetch song on component mount or when id changes
  useEffect(() => {
    // Reset played state when song id changes
    hasPlayedRef.current = false;
    lastPlayedIdRef.current = null;
    
    fetchSong();
    fetchAllSongs();
    checkIfLiked();
    
    // Proper cleanup - just reset refs, don't fetch again
    return () => {
      hasPlayedRef.current = false;
    };
  }, [id, fetchSong, fetchAllSongs, checkIfLiked]);

  // Auto-play when song data loads - only once per song
  useEffect(() => {
    // Only play if we haven't played this song yet and song data is ready
    if (
      songData && 
      songData._id && 
      songData._id === id &&  // Make sure it's the correct song for current route
      songData._id !== lastPlayedIdRef.current &&
      !hasPlayedRef.current &&
      !loading
    ) {
      hasPlayedRef.current = true;
      lastPlayedIdRef.current = songData._id;
      
      // Create playlist with current song and recommendations if available
      const fullPlaylist = allSongs.length > 0 ? [songData, ...allSongs] : [songData];
      playSong(songData, fullPlaylist);
      socketInstance.emit('play', { musicId: songData._id });
    }
  }, [songData, id, allSongs, playSong, loading]);
  
  // Event handlers
  const handlePlayPause = useCallback(() => {
    if (isCurrentSong) {
      togglePlayPause();
    } else if (songData) {
      playSong(songData);
    }
  }, [isCurrentSong, togglePlayPause, songData, playSong]);

  const handleLike = useCallback(async () => {
    try {
      if (isLiked) {
        // TODO: Add unlike API when available
        setIsLiked(false);
      } else {
        await axios.post(`${MUSIC_API}/likeSong/${id}`, {}, {
          withCredentials: true
        });
        setIsLiked(true);
      }
    } catch (err) {
      console.error('Error liking song:', err);
      // If already liked, just toggle the state
      if (err.response?.status === 400) {
        setIsLiked(true);
      }
    }
  }, [id, isLiked]);

  const handleGoBack = useCallback(() => navigate(-1), [navigate]);

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
    