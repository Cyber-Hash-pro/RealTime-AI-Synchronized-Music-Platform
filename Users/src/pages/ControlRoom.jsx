 import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMusicData } from '../Store/actions/musicaction';
import {
  SessionCodeCard,
  NowPlaying,
  QueueSection,
  AllSongsSection,
  CheckUserOnline,
  LoadingState,
} from '../components/ControlRoom';

const ControlRoom = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { code } = useParams();
  const { user } = useSelector((state) => state.user);
  const { allMusic } = useSelector((state) => state.music);
  
  // Audio Ref for independent player
  const audioRef = useRef(null);
  
  // Room States
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Check User Online States
  const [checkEmail, setCheckEmail] = useState('');
  const [checkedUsers, setCheckedUsers] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  
  // Independent Music Player States
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.7);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off');
  
  // Queue & Songs
  const [queue, setQueue] = useState([]);
  const [showSongsList, setShowSongsList] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchRoomData();
    dispatch(fetchMusicData());
  }, [code, dispatch]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      audio.volume = volume;
    };
    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeatMode, currentIndex, allMusic]);

  // Play/Pause control
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (isPlaying) {
      audio.play().catch(err => console.log('Play error:', err));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong]);

  // Load new song
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    audio.src = currentSong.musicUrl;
    audio.load();
    if (isPlaying) {
      audio.play().catch(err => console.log('Play error:', err));
    }
  }, [currentSong]);

  const fetchRoomData = async () => {
    try {
      setLoading(true);
      setRoomData({
        code: code || 'XYZ123',
        name: 'Chill Vibes Session',
        password: 'music123',
        isPrivate: true,
        host: {
          id: user?.id || '1',
          name: user?.fullName ? `${user.fullName.firstName} ${user.fullName.lastName}` : 'Host User',
          avatar: 'https://i.pravatar.cc/150?img=1',
        },
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error fetching room:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomData?.code || code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckUserOnline = () => {
    if (!checkEmail.trim()) return;
    setIsChecking(true);
    // TODO: Implement check user online functionality
    setTimeout(() => {
      setCheckedUsers(prev => [...prev, { email: checkEmail, isOnline: Math.random() > 0.5 }]);
      setIsChecking(false);
    }, 1000);
    setCheckEmail('');
  };

  // Music Player Functions
  const handlePlaySong = (song, index) => {
    setCurrentSong(song);
    setCurrentIndex(index);
    setIsPlaying(true);
    
    // Update queue
    if (allMusic && allMusic.length > 0) {
      const remainingSongs = allMusic.slice(index + 1);
      setQueue(remainingSongs.slice(0, 5));
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const seekTo = (time) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  const playNext = () => {
    if (allMusic && allMusic.length > 0) {
      let nextIndex;
      if (isShuffled) {
        nextIndex = Math.floor(Math.random() * allMusic.length);
      } else {
        nextIndex = (currentIndex + 1) % allMusic.length;
      }
      handlePlaySong(allMusic[nextIndex], nextIndex);
    }
  };

  const playPrevious = () => {
    if (allMusic && allMusic.length > 0) {
      const prevIndex = currentIndex === 0 ? allMusic.length - 1 : currentIndex - 1;
      handlePlaySong(allMusic[prevIndex], prevIndex);
    }
  };

  const addToQueue = (song) => {
    setQueue([...queue, song]);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
      setPreviousVolume(newVolume);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume);
      if (audioRef.current) audioRef.current.volume = previousVolume;
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      if (audioRef.current) audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    const modes = ['off', 'all', 'one'];
    const idx = modes.indexOf(repeatMode);
    setRepeatMode(modes[(idx + 1) % modes.length]);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  if (loading) {
    return <LoadingState message="Loading Control Room..." />;
  }

  const onlineCount = checkedUsers.filter(u => u.isOnline).length;
  const offlineCount = checkedUsers.filter(u => !u.isOnline).length;

  return (
    <div className="min-h-screen pb-32">
      {/* Header with Session Code */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-4 sm:p-6">
        <div>
          <button 
            onClick={() => navigate('/join-friends')}
            className="flex items-center gap-2 text-white hover:text-[#1db954] transition-colors mb-3"
          >
            <span className="text-lg">←</span>
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-yellow-400">👑</span>
            <span className="text-[#b3b3b3] text-sm">Control Room</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{roomData?.name || 'Session'}</h1>
          <p className="text-[#b3b3b3] text-sm mt-1">
            {onlineCount} online · {offlineCount} offline
          </p>
        </div>
        <SessionCodeCard
          code={roomData?.code || code}
          isPrivate={roomData?.isPrivate}
          password={roomData?.password}
          copied={copied}
          showPassword={showPassword}
          onCopy={copyCode}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />
      </div>

      <div className="px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Music Controls */}
        <div className="lg:col-span-2 space-y-4">
          {/* Now Playing Card */}
          <NowPlaying
            currentSong={currentSong}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            isMuted={isMuted}
            isShuffled={isShuffled}
            repeatMode={repeatMode}
            onPlayPause={togglePlayPause}
            onNext={playNext}
            onPrevious={playPrevious}
            onSeek={seekTo}
            onVolumeChange={handleVolumeChange}
            onMuteToggle={toggleMute}
            onShuffleToggle={toggleShuffle}
            onRepeatToggle={toggleRepeat}
            formatTime={formatTime}
          />

          {/* Queue Section */}
          <QueueSection
            queue={queue}
            showSongsList={showSongsList}
            onToggleSongsList={() => setShowSongsList(!showSongsList)}
            onPlaySong={(song) => {
              const index = allMusic?.findIndex(s => s._id === song._id) || 0;
              handlePlaySong(song, index);
            }}
          />

          {/* All Songs Section */}
          {showSongsList && (
            <AllSongsSection
              allMusic={allMusic}
              currentSong={currentSong}
              isPlaying={isPlaying}
              onPlaySong={handlePlaySong}
              onAddToQueue={addToQueue}
            />
          )}
        </div>

        {/* Right Column - Check User & Session Controls */}
        <div className="space-y-4">
          {/* Check User Online */}
          <CheckUserOnline
            checkEmail={checkEmail}
            setCheckEmail={setCheckEmail}
            checkedUsers={checkedUsers}
            setCheckedUsers={setCheckedUsers}
            isChecking={isChecking}
            handleCheckUserOnline={handleCheckUserOnline}
            isSocketConnected={isSocketConnected}
          />

          {/* End Session Button */}
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="metadata" />
    </div>
  );
};

export default ControlRoom;
