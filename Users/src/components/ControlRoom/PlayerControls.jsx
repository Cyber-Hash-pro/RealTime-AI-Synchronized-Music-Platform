import { 
  FaPlay, 
  FaPause, 
  FaStepForward, 
  FaStepBackward, 
  FaVolumeUp, 
  FaVolumeMute,
  FaRandom,
  FaRedo
} from 'react-icons/fa';

const PlayerControls = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isShuffled,
  repeatMode,
  onPlayPause,
  onSeek,
  onNext,
  onPrevious,
  onVolumeChange,
  onMuteToggle,
  onShuffleToggle,
  onRepeatToggle,
  formatTime
}) => {
  return (
    <>
      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime || 0}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="w-full h-1 bg-[#404040] rounded-lg appearance-none cursor-pointer accent-[#1db954]"
        />
        <div className="flex justify-between text-[#b3b3b3] text-xs mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-6">
        <button 
          onClick={onShuffleToggle}
          className={`text-xl transition-colors ${isShuffled ? 'text-[#1db954]' : 'text-[#b3b3b3] hover:text-white'}`}
          title="Shuffle"
        >
          <FaRandom />
        </button>
        
        <button 
          onClick={onPrevious}
          className="text-2xl text-white hover:text-[#1db954] transition-colors"
        >
          <FaStepBackward />
        </button>
        
        <button 
          onClick={onPlayPause}
          className="w-14 h-14 bg-[#1db954] rounded-full flex items-center justify-center hover:scale-105 transition-transform"
        >
          {isPlaying ? (
            <FaPause className="text-black text-xl" />
          ) : (
            <FaPlay className="text-black text-xl ml-1" />
          )}
        </button>
        
        <button 
          onClick={onNext}
          className="text-2xl text-white hover:text-[#1db954] transition-colors"
        >
          <FaStepForward />
        </button>
        
        <button 
          onClick={onRepeatToggle}
          className={`text-xl transition-colors relative ${repeatMode !== 'off' ? 'text-[#1db954]' : 'text-[#b3b3b3] hover:text-white'}`}
          title={`Repeat: ${repeatMode}`}
        >
          <FaRedo />
          {repeatMode === 'one' && (
            <span className="absolute -top-1 -right-1 text-[8px] bg-[#1db954] text-black w-3 h-3 rounded-full flex items-center justify-center font-bold">1</span>
          )}
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <button onClick={onMuteToggle} className="text-[#b3b3b3] hover:text-white">
          {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={onVolumeChange}
          className="w-32 h-1 bg-[#404040] rounded-lg appearance-none cursor-pointer accent-[#1db954]"
        />
      </div>
    </>
  );
};

export default PlayerControls;
