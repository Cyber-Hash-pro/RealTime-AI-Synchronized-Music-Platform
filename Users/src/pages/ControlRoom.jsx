import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaArrowLeft, 
  FaCopy, 
  FaCheck, 
  FaLock, 
  FaPlay, 
  FaPause, 
  FaStepForward, 
  FaStepBackward, 
  FaVolumeUp, 
  FaVolumeMute,
  FaRandom,
  FaRedo,
  FaCrown,
  FaCircle,
  FaTimes,
  FaMusic,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaList,
  FaWifi,
  FaUsers
} from 'react-icons/fa';
import { fetchMusicData, specificMusicData } from '../Store/actions/musicaction';
import socketService from '../services/socket.service';

const ControlRoom = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { code } = useParams();
  const { user } = useSelector((state) => state.user);
  const { allMusic } = useSelector((state) => state.music);
  
  // Audio Ref for independent player
  const audioRef = useRef(null);
  
  // Socket States
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  
  // Room States
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Members States
  const [members, setMembers] = useState([]);
  const [showCheckUser, setShowCheckUser] = useState(false);
  const [checkEmail, setCheckEmail] = useState('');
  const [checkError, setCheckError] = useState('');
  const [checkedUsers, setCheckedUsers] = useState([]); // List of checked users with their status
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
  const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'all', 'one'
  
  // Queue & Songs
  const [queue, setQueue] = useState([]);
  const [showSongsList, setShowSongsList] = useState(true); // Show songs by default
  const [currentIndex, setCurrentIndex] = useState(0);
  // np103177

  // Initialize socket connection
  useEffect(() => {
    const socket = socketService.connect();
    
    socket.on('connect', () => {
      console.log('Socket connected in ControlRoom');
      setIsSocketConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected in ControlRoom');
      setIsSocketConnected(false);
    });

    // Listen for play events from other devices (for synced listening)
    socketService.onPlay(async (data) => {
      console.log('Received play from another device:', data.musicId);
      if (data.musicId) {
        // Find the song in allMusic and play it
        const songToPlay = allMusic?.find(song => song._id === data.musicId);
        if (songToPlay) {
          const songIndex = allMusic.findIndex(song => song._id === data.musicId);
          setCurrentSong(songToPlay);
          setCurrentIndex(songIndex);
          setIsPlaying(true);
        }
      }
    });

    // Listen for user status updates
    socketService.onUserStatus((data) => {
      // Update member online status
      setMembers(prevMembers => 
        prevMembers.map(member => 
          member.email === data.email 
            ? { ...member, isOnline: data.isOnline }
            : member
        )
      );
    });

    // Listen for user offline events
    socketService.onUserOffline((data) => {
      setMembers(prevMembers => 
        prevMembers.map(member => 
          member.email === data.email 
            ? { ...member, isOnline: false }
            : member
        )
      );
    });

    return () => {
      socketService.offPlay();
    };
  }, [allMusic]);

  // Check online status of members periodically
  useEffect(() => {
    if (isSocketConnected && members.length > 0) {
      members.forEach(member => {
        if (!member.isHost) {
          socketService.checkUserOnline(member.email);
        }
      });
    }
  }, [isSocketConnected, members.length]);
// np103177
  useEffect(() => {
    fetchRoomData();
    // Fetch all songs
    console.log("Fetching music data...");
    dispatch(fetchMusicData());
    // Poll for member updates every 5 seconds
    const interval = setInterval(fetchMembers, 5000);
    return () => clearInterval(interval);
  }, [code, dispatch]);

  // Debug: Log allMusic when it changes
  useEffect(() => {
    console.log("allMusic updated:", allMusic);
  }, [allMusic]);

  // Handle audio events
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

  // Play/Pause when isPlaying changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (isPlaying) {
      audio.play().catch(err => console.log('Play error:', err));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong]);

  // Load new song when currentSong changes
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
      // Simulate API call
      // const response = await axios.get(`http://localhost:3001/api/music/sessions/${code}`, {
      //   withCredentials: true,
      // });
      // setRoomData(response.data);
      
      // Dummy data for now
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
      
      // Fetch members
      fetchMembers();
    } catch (err) {
      console.error("Error fetching room:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    // Only set the host (current user) as member
    setMembers([
      { 
        id: '1', 
        name: user?.fullName ? `${user.fullName.firstName} ${user.fullName.lastName}` : 'You', 
        email: user?.email || 'you@email.com',
        avatar: 'https://i.pravatar.cc/150?img=1', 
        isOnline: true, 
        isHost: true,
        joinedAt: new Date().toISOString()
      }
    ]);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomData?.code || code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Check if user is online by email using socket
  const handleCheckUserOnline = () => {
    if (!checkEmail.trim()) {
      setCheckError('Please enter an email address');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(checkEmail)) {
      setCheckError('Please enter a valid email address');
      return;
    }
    
    // Check if already checked this email
    const alreadyChecked = checkedUsers.find(u => u.email === checkEmail);
    if (alreadyChecked) {
      setCheckError('This email has already been checked');
      return;
    }
    
    setIsChecking(true);
    setCheckError('');
    
    // Emit socket event to check user online status
    socketService.checkUserOnline(checkEmail);
    
    // Listen for response (handled in useEffect, but also add temp listener here)
    const handleStatus = (data) => {
      if (data.email === checkEmail) {
        setCheckedUsers(prev => [...prev, {
          email: data.email,
          isOnline: data.isOnline,
          checkedAt: new Date().toISOString()
        }]);
        setCheckEmail('');
        setIsChecking(false);
      }
    };
    
    socketService.onUserStatus(handleStatus);
    
    // Timeout if no response
    setTimeout(() => {
      if (isChecking) {
        setCheckedUsers(prev => [...prev, {
          email: checkEmail,
          isOnline: false,
          checkedAt: new Date().toISOString()
        }]);
        setCheckEmail('');
        setIsChecking(false);
      }
    }, 3000);
  };
  
  // Remove checked user from list
  const removeCheckedUser = (email) => {
    setCheckedUsers(prev => prev.filter(u => u.email !== email));
  };

  // Play a specific song
  const handlePlaySong = (song, index) => {
    setCurrentSong(song);
    setCurrentIndex(index);
    setIsPlaying(true);
    
    // Emit play event to sync with other devices/members
    socketService.emitPlay(song._id);
    
    // Update queue to show songs after current
    if (allMusic && allMusic.length > 0) {
      const remainingSongs = allMusic.slice(index + 1);
      setQueue(remainingSongs.slice(0, 5)); // Show next 5 songs
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Seek to position
  const seekTo = (time) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Play next song
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

  // Play previous song
  const playPrevious = () => {
    if (allMusic && allMusic.length > 0) {
      const prevIndex = currentIndex === 0 ? allMusic.length - 1 : currentIndex - 1;
      handlePlaySong(allMusic[prevIndex], prevIndex);
    }
  };

  // Add song to queue
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
      if (audioRef.current) {
        audioRef.current.volume = previousVolume;
      }
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
      setIsMuted(true);
    }
  };

  const toggleRepeat = () => {
    const modes = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const endSession = async () => {
    if (confirm('Are you sure you want to end this session?')) {
      try {
        // await axios.delete(`http://localhost:3001/api/music/sessions/${code}`);
        navigate('/join-friends');
      } catch (err) {
        console.error("Error ending session:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1db954] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Control Room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="p-4 sm:p-6 bg-gradient-to-b from-purple-900/50 to-transparent">
        <button 
          onClick={() => navigate('/join-friends')}
          className="flex items-center gap-2 text-white hover:text-[#1db954] transition-colors mb-6"
        >
          <FaArrowLeft className="text-xl" />
          <span className="text-lg font-medium">Back</span>
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FaCrown className="text-yellow-400 text-xl" />
              <span className="text-[#b3b3b3] text-sm">Control Room</span>
              {/* Socket Connection Status */}
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${
                isSocketConnected 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                <FaWifi className="text-[10px]" />
                {isSocketConnected ? 'Synced' : 'Offline'}
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{roomData?.name || 'Session'}</h1>
            <p className="text-[#b3b3b3]">
              {checkedUsers.filter(u => u.isOnline).length} online · {checkedUsers.filter(u => !u.isOnline).length} offline
            </p>
          </div>

          {/* Session Code Card */}
          <div className="bg-[#282828] rounded-xl p-5 border border-[#404040] min-w-[280px]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#b3b3b3] text-sm font-medium">Session Code</span>
              {roomData?.isPrivate && (
                <span className="flex items-center gap-1 text-yellow-400 text-xs">
                  <FaLock className="text-xs" />
                  Private
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-mono font-bold text-white tracking-[0.3em]">
                {roomData?.code || code}
              </span>
              <button
                onClick={copyCode}
                className="p-2 bg-[#404040] hover:bg-[#505050] rounded-lg transition-colors"
                title="Copy code"
              >
                {copied ? <FaCheck className="text-green-400" /> : <FaCopy className="text-white" />}
              </button>
            </div>
            
            {roomData?.isPrivate && roomData?.password && (
              <div className="pt-3 border-t border-[#404040]">
                <div className="flex items-center justify-between">
                  <span className="text-[#b3b3b3] text-sm">Password</span>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#b3b3b3] hover:text-white"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <p className="text-white font-mono mt-1">
                  {showPassword ? roomData.password : '••••••••'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Music Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Now Playing Card */}
          <div className="bg-[#181818] rounded-xl p-6 border border-[#282828]">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaMusic className="text-[#1db954]" />
              Now Playing
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Album Art */}
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl overflow-hidden shadow-2xl flex-shrink-0">
                <img 
                  src={currentSong?.coverImage || 'https://placehold.co/200x200/1db954/ffffff?text=♪'} 
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

                {/* Progress Bar */}
                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime || 0}
                    onChange={(e) => seekTo(parseFloat(e.target.value))}
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
                    onClick={() => setIsShuffled(!isShuffled)}
                    className={`text-xl transition-colors ${isShuffled ? 'text-[#1db954]' : 'text-[#b3b3b3] hover:text-white'}`}
                    title="Shuffle"
                  >
                    <FaRandom />
                  </button>
                  
                  <button 
                    onClick={playPrevious}
                    className="text-2xl text-white hover:text-[#1db954] transition-colors"
                  >
                    <FaStepBackward />
                  </button>
                  
                  <button 
                    onClick={togglePlayPause}
                    className="w-14 h-14 bg-[#1db954] rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    {isPlaying ? (
                      <FaPause className="text-black text-xl" />
                    ) : (
                      <FaPlay className="text-black text-xl ml-1" />
                    )}
                  </button>
                  
                  <button 
                    onClick={playNext}
                    className="text-2xl text-white hover:text-[#1db954] transition-colors"
                  >
                    <FaStepForward />
                  </button>
                  
                  <button 
                    onClick={toggleRepeat}
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
                  <button onClick={toggleMute} className="text-[#b3b3b3] hover:text-white">
                    {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-32 h-1 bg-[#404040] rounded-lg appearance-none cursor-pointer accent-[#1db954]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Queue Section */}
          <div className="bg-[#181818] rounded-xl p-6 border border-[#282828]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Up Next</h2>
              <button
                onClick={() => setShowSongsList(!showSongsList)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  showSongsList ? 'bg-[#1db954] text-black' : 'bg-[#282828] text-white hover:bg-[#303030]'
                }`}
              >
                <FaList />
                {showSongsList ? 'Hide Songs' : 'Browse All'}
              </button>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {queue.length === 0 ? (
                <p className="text-[#b3b3b3] text-center py-4">No songs in queue - Browse and select a song to play</p>
              ) : (
                queue.map((song, index) => (
                  <div 
                    key={song._id || song.id}
                    onClick={() => handlePlaySong(song, allMusic?.findIndex(s => s._id === song._id) || 0)}
                    className="flex items-center gap-4 p-3 bg-[#282828] rounded-lg hover:bg-[#303030] transition-colors cursor-pointer group"
                  >
                    <span className="text-[#b3b3b3] w-6 text-center group-hover:hidden">{index + 1}</span>
                    <FaPlay className="text-white w-6 text-center hidden group-hover:block" />
                    <img 
                      src={song.coverImage || song.cover || 'https://placehold.co/60x60/1db954/ffffff?text=♪'} 
                      alt={song.title} 
                      className="w-12 h-12 rounded-lg object-cover" 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{song.title}</p>
                      <p className="text-[#b3b3b3] text-sm truncate">{song.artist}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* All Songs Section */}
          {showSongsList && (
            <div className="bg-[#181818] rounded-xl p-6 border border-[#282828]">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaMusic className="text-[#1db954]" />
                All Songs ({allMusic?.length || 0})
              </h2>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {allMusic === undefined || allMusic === null ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1db954]"></div>
                    <span className="ml-3 text-[#b3b3b3]">Loading songs...</span>
                  </div>
                ) : allMusic.length === 0 ? (
                  <div className="text-center py-8">
                    <FaMusic className="text-4xl text-[#535353] mx-auto mb-3" />
                    <p className="text-[#b3b3b3]">No songs available</p>
                    <p className="text-[#535353] text-sm mt-1">Check if the music service is running</p>
                  </div>
                ) : (
                  allMusic.map((song, index) => (
                    <div 
                      key={song._id}
                      onClick={() => handlePlaySong(song, index)}
                      className={`flex items-center gap-4 p-3 rounded-lg transition-colors cursor-pointer group ${
                        currentSong?._id === song._id 
                          ? 'bg-[#1db954]/20 border border-[#1db954]/40' 
                          : 'bg-[#282828] hover:bg-[#303030]'
                      }`}
                    >
                      <div className="w-6 flex items-center justify-center">
                        {currentSong?._id === song._id && isPlaying ? (
                          <div className="flex items-end gap-0.5 h-4">
                            <div className="w-1 bg-[#1db954] animate-pulse" style={{height: '60%'}}></div>
                            <div className="w-1 bg-[#1db954] animate-pulse" style={{height: '100%', animationDelay: '0.2s'}}></div>
                            <div className="w-1 bg-[#1db954] animate-pulse" style={{height: '40%', animationDelay: '0.4s'}}></div>
                          </div>
                        ) : (
                          <>
                            <span className="text-[#b3b3b3] group-hover:hidden">{index + 1}</span>
                            <FaPlay className="text-white hidden group-hover:block text-sm" />
                          </>
                        )}
                      </div>
                      <img 
                        src={song.coverUrl|| 'https://placehold.co/60x60/1db954/ffffff?text=♪'} 
                        alt={song.title} 
                        className="w-12 h-12 rounded-lg object-cover" 
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${currentSong?._id === song._id ? 'text-[#1db954]' : 'text-white'}`}>
                          {song.title}
                        </p>
                        <p className="text-[#b3b3b3] text-sm truncate">{song.artist}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToQueue(song);
                        }}
                        className="p-2 text-[#b3b3b3] hover:text-white hover:bg-[#404040] rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        title="Add to queue"
                      >
                        <FaList className="text-xs" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Members & Check Online */}
        <div className="space-y-6">
          {/* Check User Online Card */}
          <div className="bg-[#181818] rounded-xl p-6 border border-[#282828]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaUsers className="text-[#1db954]" />
                Check User Status
              </h2>
            </div>

            {/* Check User Input */}
            <div className="mb-4 p-4 bg-[#282828] rounded-lg border border-[#404040]">
              <h3 className="text-white font-medium mb-3">Check if user is online</h3>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b3b3b3]" />
                  <input
                    type="email"
                    value={checkEmail}
                    onChange={(e) => setCheckEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCheckUserOnline()}
                    placeholder="Enter email to check..."
                    className="w-full bg-[#121212] text-white pl-10 pr-4 py-2 rounded-lg border border-[#404040] focus:border-[#1db954] focus:outline-none text-sm"
                  />
                </div>
                <button
                  onClick={handleCheckUserOnline}
                  disabled={isChecking}
                  className="px-4 py-2 bg-[#1db954] text-black rounded-lg font-medium hover:bg-[#1ed760] transition-colors text-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {isChecking ? (
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  ) : (
                    'Check'
                  )}
                </button>
              </div>
              {checkError && <p className="text-red-400 text-sm mt-2">{checkError}</p>}
            </div>

            {/* Checked Users List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {checkedUsers.length === 0 ? (
                <p className="text-[#b3b3b3] text-center py-4 text-sm">
                  Enter an email to check if a user is online
                </p>
              ) : (
                checkedUsers.map((checkedUser, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 bg-[#282828] rounded-lg"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-[#404040] flex items-center justify-center">
                        <FaEnvelope className="text-[#b3b3b3]" />
                      </div>
                      {/* Online/Offline Indicator */}
                      <FaCircle 
                        className={`absolute -bottom-0.5 -right-0.5 text-[10px] ${
                          checkedUser.isOnline ? 'text-green-500' : 'text-red-500'
                        } drop-shadow-lg`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{checkedUser.email}</p>
                      <p className="text-[#b3b3b3] text-xs">
                        Checked at {new Date(checkedUser.checkedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        checkedUser.isOnline 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {checkedUser.isOnline ? 'Online' : 'Offline'}
                      </span>
                      <button
                        onClick={() => removeCheckedUser(checkedUser.email)}
                        className="p-1.5 text-[#b3b3b3] hover:text-white hover:bg-[#404040] rounded-lg transition-colors"
                        title="Remove"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Summary */}
            {checkedUsers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#282828] flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <FaCircle className="text-green-500 text-[8px]" />
                  <span className="text-[#b3b3b3]">{checkedUsers.filter(u => u.isOnline).length} Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCircle className="text-red-500 text-[8px]" />
                  <span className="text-[#b3b3b3]">{checkedUsers.filter(u => !u.isOnline).length} Offline</span>
                </div>
              </div>
            )}
          </div>

          {/* End Session Button */}
          <button
            onClick={endSession}
            className="w-full py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-medium hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
          >
            <FaTimes />
            End Session
          </button>
        </div>
      </div>

      {/* Hidden Audio Element - Independent from MusicContext */}
      <audio ref={audioRef} preload="metadata" />
    </div>
  );
};

export default ControlRoom;
