 import { useState, useEffect, useRef } from 'react';
import { data, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMusicData } from '../Store/actions/musicaction';
import { v4 as uuidv4 } from 'uuid';
import {
  SessionCodeCard,
  NowPlaying,
  QueueSection,
  AllSongsSection,
  CheckUserOnline,
  LoadingState,
} from '../components/ControlRoom';
import socketInstance from '../socket.service.js';
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
  const [sessionCreated, setSessionCreated] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0); // Cooldown in seconds
  const cooldownRef = useRef(null);
  
  // Check User Online States
  const [checkEmail, setCheckEmail] = useState('');
  const [checkedUsers, setCheckedUsers] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
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

  // Generate random password
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Create new session with UUID and password
  const createSession = () => {
    // Check if cooldown is active
    if (cooldownTime > 0) return;
    
    const sessionId = uuidv4().split('-')[0].toUpperCase(); // Short UUID (first 8 chars)
    const sessionPassword = generatePassword();
    
    setRoomData(prev => ({
      ...prev,
      code: sessionId,
      password: sessionPassword,
      isPrivate: true,
      createdAt: new Date().toISOString(),
    }));
    
    setSessionCreated(true);
    console.log("Session Created:", { id: sessionId, password: sessionPassword });
    
    // Emit to socket to create room on server
    socketInstance.emit('create-session', { 
      sessionId, 
      password: sessionPassword,
      hostEmail: user?.email 
    });

    // Start 30 minute cooldown (1800 seconds)
    setCooldownTime(30 * 60);
    
    // Clear any existing interval
    if (cooldownRef.current) {
      clearInterval(cooldownRef.current);
    }
    
    // Start countdown timer
    cooldownRef.current = setInterval(() => {
      setCooldownTime(prev => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (cooldownRef.current) {
        clearInterval(cooldownRef.current);
      }
    };
  }, []);

  // Format cooldown time as MM:SS
  const formatCooldown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCheckUserOnline = () => {
    if (!checkEmail.trim()) return;
    console.log("Checking online status for:", checkEmail);
    setIsChecking(true);
    socketInstance.emit('check-user-online', checkEmail);
    setCheckEmail('');
  };

  useEffect(() => {
    socketInstance.on('user-status', (data) => {
      console.log("Received user status update", data);
      // Update checkedUsers with the response
      setCheckedUsers(prev => {
        // Remove existing entry for this email if exists
        const filtered = prev.filter(u => u.email !== data.email);
        return [...filtered, { email: data.email, isOnline: data.isOnline }];
      });
      setIsChecking(false);
    });

    return () => {
      socketInstance.off('user-status');
    };
  }, []);


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
          {/* Create Session Button */}
          <div className="bg-[#181818] rounded-xl p-6 border border-[#282828]">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              🎵 Session Controls
            </h2>
            
            {!sessionCreated ? (
              <button
                onClick={createSession}
                className="w-full px-6 py-3 bg-[#1db954] text-black rounded-lg font-medium hover:bg-[#1ed760] transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-lg">+</span>
                Create New Session
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#282828] rounded-lg">
                  <span className="text-[#b3b3b3] text-sm">Session ID:</span>
                  <span className="text-white font-mono font-bold">{roomData?.code}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#282828] rounded-lg">
                  <span className="text-[#b3b3b3] text-sm">Password:</span>
                  <span className="text-white font-mono">{showPassword ? roomData?.password : '••••••••'}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex-1 px-4 py-2 bg-[#282828] text-white rounded-lg hover:bg-[#383838] transition-colors text-sm"
                  >
                    {showPassword ? 'Hide' : 'Show'} Password
                  </button>
                  <button
                    onClick={createSession}
                    disabled={cooldownTime > 0}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                      cooldownTime > 0 
                        ? 'bg-[#383838] text-[#b3b3b3] cursor-not-allowed' 
                        : 'bg-[#1db954] text-black hover:bg-[#1ed760]'
                    }`}
                  >
                    {cooldownTime > 0 ? formatCooldown(cooldownTime) : 'New Session'}
                  </button>
                </div>
                {cooldownTime > 0 && (
                  <p className="text-yellow-500 text-xs text-center mt-2">
                    ⏱️ Wait {formatCooldown(cooldownTime)} before creating a new session
                  </p>
                )}
                <p className="text-[#b3b3b3] text-xs text-center mt-2">
                  Share the Session ID and Password with friends to join!
                </p>
              </div>
            )}
          </div>

          {/* Check User Online */}
          <CheckUserOnline
            checkEmail={checkEmail}
            setCheckEmail={setCheckEmail}
            checkedUsers={checkedUsers}
            setCheckedUsers={setCheckedUsers}
            isChecking={isChecking}
            handleCheckUserOnline={handleCheckUserOnline}
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
