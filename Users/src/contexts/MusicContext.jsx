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
  const audioRef = useRef(null);
  const isPlayingRef = useRef(false); // Track playing state without causing re-renders

  const playSong = useCallback((song) => {
    if (!song) return;
    
    // If same song, just toggle play/pause
    if (currentSong?.musicUrl === song.musicUrl) {
      togglePlayPause();
      return;
    }
    
    setCurrentSong(song);
    isPlayingRef.current = true;
    setIsPlaying(true);
  }, [currentSong]);

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

  // Handle song change - load and play new song
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    
    const audio = audioRef.current;
    
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
    playSong,
    pauseSong,
    togglePlayPause,
    seekTo,
    setVolumeLevel,
    setCurrentTime,
    setDuration,
    setIsPlaying,
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
      {/* Global Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong?.musicUrl || null}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={handlePlay}
        onPause={handlePause}
        preload="metadata"
      />
    </MusicContext.Provider>
  );
};