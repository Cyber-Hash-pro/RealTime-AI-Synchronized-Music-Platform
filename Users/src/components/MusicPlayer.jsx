import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRandom, FaRedo, FaVolumeUp, FaHeart } from 'react-icons/fa';
import { useMemo, useEffect } from 'react';
import { useMusicPlayer } from '../contexts/MusicContext';

const MusicPlayer = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    audioRef,
    togglePlayPause,
    seekTo,
    setVolumeLevel,
    formatTime
  } = useMusicPlayer();

  const sliderVars = useMemo(() => {
    const progress = duration ? (currentTime / duration) * 100 : 0;
    const volumePercent = volume * 100;
    return {
      progress: { '--range-progress': `${progress}%` },
      volume: { '--range-progress': `${volumePercent}%` }
    };
  }, [currentTime, duration, volume]);
const nextplay=()=>{
  // Logic to play the next song
  alert("next song")
  
} 
  // Sync audio element with playing state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioRef]);

  const handleSeek = (event) => {
    const newProgress = Number(event.target.value);
    const newTime = (newProgress / 100) * duration;
    seekTo(newTime);
  };

  const handleVolumeChange = (event) => {
    const newVolume = Number(event.target.value) / 100;
    setVolumeLevel(newVolume);
  };

  // Don't render if no song is playing
  if (!currentSong) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 lg:left-[250px] right-0 bg-[#181818] border-t border-[#282828] px-2 lg:px-4 py-2 lg:py-3 z-50">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-2 lg:gap-4">
        
        {/* Left - Current Song Info */}
        <div className="flex items-center gap-2 lg:gap-3 w-auto lg:w-1/4 min-w-0 lg:min-w-[180px]">
          <img
            src={currentSong.coverUrl || currentSong.cover}
            alt={currentSong.title}
            className="w-12 h-12 lg:w-14 lg:h-14 rounded object-cover"
            onError={(e) => {
              e.target.src = 'https://placehold.co/100x100/1db954/ffffff?text=Music';
            }}
          />
          <div className="flex-1 min-w-0 hidden sm:block">
            <div className="text-white text-xs lg:text-sm font-medium truncate">
              {currentSong.title}
            </div>
            <div className="text-[#b3b3b3] text-xs truncate">
              {currentSong.artist}
            </div>
          </div>
          <button className="text-[#b3b3b3] hover:text-white transition-colors hidden lg:block">
            <FaHeart className="text-base lg:text-lg" />
          </button>
        </div>

        {/* Center - Player Controls */}
        <div className="flex flex-col items-center gap-1 lg:gap-2 flex-1 max-w-2xl">
          <div className="flex items-center gap-3 lg:gap-6">
            <button className="text-[#b3b3b3] hover:text-white transition-colors hidden lg:block">
              <FaRandom className="text-sm" />
            </button>
            <button className="text-[#b3b3b3] hover:text-white transition-colors">
              <FaStepBackward className="text-base lg:text-lg" />
            </button>
            <button
              onClick={togglePlayPause}
              className="bg-white text-black p-2 lg:p-2.5 rounded-full hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <FaPause className="text-base lg:text-lg" />
              ) : (
                <FaPlay className="text-base lg:text-lg ml-0.5" />
              )}
            </button>
            <button onClick={nextplay} className="text-[#b3b3b3] hover:text-white transition-colors">
              <FaStepForward className="text-base lg:text-lg" />
            </button>
            <button className="text-[#b3b3b3] hover:text-white transition-colors hidden lg:block">
              <FaRedo className="text-sm" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-[#b3b3b3] w-8 lg:w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={duration ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              aria-label="Playback progress"
              className="range-slider flex-1"
              style={sliderVars.progress}
            />
            <span className="text-xs text-[#b3b3b3] w-8 lg:w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right - Volume Control */}
        <div className="hidden lg:flex items-center gap-3 w-1/4 justify-end">
          <FaVolumeUp className="text-[#b3b3b3]" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={handleVolumeChange}
            aria-label="Volume"
            className="range-slider w-24"
            style={sliderVars.volume}
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
