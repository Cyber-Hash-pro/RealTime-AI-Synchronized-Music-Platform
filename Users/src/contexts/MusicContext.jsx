import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const MusicContext = createContext();

export const useMusicPlayer = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicProvider');
  }
  return context;
};

export const MusicProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [playlist, setPlaylistState] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const audioRef = useRef(null);
  const isPlayingRef = useRef(false); // Track playing state without causing re-renders

  // Set the playlist (queue of songs)
  const setPlaylist = useCallback((songs, startIndex = 0) => {
    setPlaylistState(songs);
    setCurrentIndex(startIndex);
  }, []);

  const playSong = useCallback((song, songs = null, index = -1) => {
    if (!song) return;
    
    // If same song, just toggle play/pause
    if (currentSong?.musicUrl === song.musicUrl) {
      togglePlayPause();
      return;
    }
    
    // Pause current audio immediately to prevent echo/overlap
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Update playlist if provided
    if (songs && songs.length > 0) {
      setPlaylistState(songs);
      setCurrentIndex(index >= 0 ? index : songs.findIndex(s => s._id === song._id || s.musicUrl === song.musicUrl));
    } else if (playlist.length > 0) {
      // Find index in current playlist
      const foundIndex = playlist.findIndex(s => s._id === song._id || s.musicUrl === song.musicUrl);
      if (foundIndex >= 0) {
        setCurrentIndex(foundIndex);
      }
    }
    
    setCurrentSong(song);
    isPlayingRef.current = true;
    setIsPlaying(true);
  }, [currentSong, playlist]);

  const pauseSong = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !currentSong) return;
    
    if (isPlayingRef.current) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
  }, [currentSong]);

  const seekTo = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolumeLevel = useCallback((vol) => {
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  }, []);

  const formatTime = useCallback((time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Play next song in playlist
  const playNext = useCallback(() => {
    if (playlist.length === 0) return;
    
    // Pause current audio immediately to prevent echo
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextSong = playlist[nextIndex];
    
    if (nextSong) {
      setCurrentIndex(nextIndex);
      setCurrentSong(nextSong);
      isPlayingRef.current = true;
      setIsPlaying(true);
    }
  }, [playlist, currentIndex]);

  // Play previous song in playlist
  const playPrevious = useCallback(() => {
    if (playlist.length === 0) return;
    
    // If current time > 3 seconds, restart the song instead
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    
    // Pause current audio immediately to prevent echo
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    const prevSong = playlist[prevIndex];
    
    if (prevSong) {
      setCurrentIndex(prevIndex);
      setCurrentSong(prevSong);
      isPlayingRef.current = true;
      setIsPlaying(true);
    }
  }, [playlist, currentIndex]);

  // Handle song change - load and play new song
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    
    const audio = audioRef.current;
    
    // Stop any current playback completely
    audio.pause();
    audio.currentTime = 0;
    
    // Set new source manually (not through React's src attribute)
    audio.src = currentSong.musicUrl;
    
    const handleCanPlay = () => {
      if (isPlayingRef.current) {
        audio.play().catch(console.error);
      }
    };
    
    audio.load();
    audio.addEventListener('canplay', handleCanPlay, { once: true });
    
    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [currentSong?.musicUrl]); // Only trigger when musicUrl changes

  const value = {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    audioRef,
    playlist,
    currentIndex,
    playSong,
    pauseSong,
    togglePlayPause,
    seekTo,
    setVolumeLevel,
    setCurrentTime,
    setDuration,
    setIsPlaying,
    setPlaylist,
    playNext,
    playPrevious,
    formatTime
  };

  // Audio event handlers - defined outside to prevent recreation
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      audioRef.current.volume = volume;
    }
  };

  const handleEnded = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
  };

  const handlePlay = () => {
    isPlayingRef.current = true;
    setIsPlaying(true);
  };

  const handlePause = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
      {/* Global Audio Element - src is managed manually in useEffect to prevent echo */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={handlePlay}
        onPause={handlePause}
        preload="auto"
      />
    </MusicContext.Provider>
  );
};