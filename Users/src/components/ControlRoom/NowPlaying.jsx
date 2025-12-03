import { FaMusic } from 'react-icons/fa';
import PlayerControls from './PlayerControls';

const NowPlaying = ({
  currentSong,
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
    <div className="bg-[#181818] rounded-xl p-6 border border-[#282828]">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FaMusic className="text-[#1db954]" />
        Now Playing
      </h2>
      
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Album Art */}
        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl overflow-hidden shadow-2xl flex-shrink-0">
          <img 
            src={currentSong?.coverImage || currentSong?.coverUrl || 'https://placehold.co/200x200/1db954/ffffff?text=♪'} 
            alt="Album Art"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Song Info & Controls */}
        <div className="flex-1 w-full">
          <h3 className="text-2xl font-bold text-white mb-1">
            {currentSong?.title || 'No song playing'}
          </h3>
          <p className="text-[#b3b3b3] text-lg mb-6">
            {currentSong?.artist || 'Select a song to play'}
          </p>

          <PlayerControls 
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            isMuted={isMuted}
            isShuffled={isShuffled}
            repeatMode={repeatMode}
            onPlayPause={onPlayPause}
            onSeek={onSeek}
            onNext={onNext}
            onPrevious={onPrevious}
            onVolumeChange={onVolumeChange}
            onMuteToggle={onMuteToggle}
            onShuffleToggle={onShuffleToggle}
            onRepeatToggle={onRepeatToggle}
            formatTime={formatTime}
          />
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
