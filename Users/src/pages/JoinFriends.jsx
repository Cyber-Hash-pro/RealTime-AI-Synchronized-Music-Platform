import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaUsers, 
  FaHeadphones, 
  FaBroadcastTower, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaSignOutAlt,
  FaVolumeUp,
  FaCrown,
  FaPlay,
  FaPause
} from 'react-icons/fa';
import { useMusicPlayer } from '../contexts/MusicContext';
import socketInstance from '../socket.service.js';

const JoinFriends = () => {
  const navigate = useNavigate();
  const { playSong, currentSong, isPlaying, togglePlayPause } = useMusicPlayer();
  const audioRef = useRef(null);
  
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinCode, setJoinCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Password Modal & Listener View States
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [volumeLevel, setVolumeLevel] = useState(75);
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState('');
  
  // Audio playback states for listener
  const [listenerAudio, setListenerAudio] = useState({
    src: '',
    thumbnail: '',
    title: 'Waiting for host...',
    artist: '',
    currentTime: 0,
    volume: 0.7,
    isPlaying: false,
    senderDetails: null
  });

  useEffect(() => {
    // Load dummy sessions data
    setSessions([
      { _id: '1', hostName: 'Rahul Sharma', hostAvatar: 'https://i.pravatar.cc/150?img=1', songTitle: 'Blinding Lights', artist: 'The Weeknd', listeners: 5, code: 'ABC12345' },
      { _id: '2', hostName: 'Priya Patel', hostAvatar: 'https://i.pravatar.cc/150?img=5', songTitle: 'Levitating', artist: 'Dua Lipa', listeners: 3, code: 'XYZ78901' },
    ]);
    setLoading(false);
  }, []);

  const handleJoinWithCode = () => {
    if (joinCode.trim()) {
      // Show password modal when code is entered
      setShowPasswordModal(true);
      setPasswordError('');
      setEnteredPassword('');
    }
  };

  const handlePasswordSubmit = () => {
    if (!enteredPassword.trim()) {
      setPasswordError('Please enter the password');
      return;
    }
    
    setIsVerifying(true);
    setPasswordError('');
    
    // Emit joinroom event to socket
    socketInstance.emit('joinroom', {
      roomId: joinCode,
      password: enteredPassword
    });
  };

  // Listen for socket room events
  useEffect(() => {
    socketInstance.on('roomJoined', (roomId) => {
      console.log("Successfully joined room:", roomId);
      setShowPasswordModal(false);
      setIsJoined(true);
      setCurrentRoomId(roomId);
      setSessionData({
        hostName: 'Host',
        hostAvatar: 'https://i.pravatar.cc/150?img=68',
        songTitle: 'Waiting for host to play...',
        artist: '',
        albumArt: 'https://placehold.co/400x400/1db954/ffffff?text=🎵',
        listeners: 1,
        isLive: true
      });
      setPasswordError('');
      setIsVerifying(false);
    });

    socketInstance.on('roomError', (data) => {
      console.log("Room error:", data);
      setPasswordError(data.message);
      setIsVerifying(false);
    });

    // Listen for audio from host
    socketInstance.on('receive-audio', (data) => {
      console.log("Received audio from host:", data);
      setListenerAudio({
        src: data.src,
        thumbnail: data.thumbnail,
        title: 'Now Playing',
        artist: data.senderDetails?.name || 'Host',
        currentTime: data.currentTime || 0,
        volume: data.volume || 0.7,
        isPlaying: true,
        senderDetails: data.senderDetails
      });
      
      // Update session data with new song info
      setSessionData(prev => ({
        ...prev,
        hostName: data.senderDetails?.name || 'Host',
        albumArt: data.thumbnail || prev?.albumArt,
        songTitle: 'Live Audio',
        artist: data.senderDetails?.name || 'Host'
      }));

      // Play the audio
      if (audioRef.current) {
        audioRef.current.src = data.src;
        audioRef.current.currentTime = data.currentTime || 0;
        audioRef.current.volume = data.volume || 0.7;
        audioRef.current.play().catch(err => console.log('Autoplay blocked:', err));
      }
    });

    return () => {
      socketInstance.off('roomJoined');
      socketInstance.off('roomError');
      socketInstance.off('receive-audio');
    };
  }, []);

  const handleExitSession = () => {
    setIsJoined(false);
    setSessionData(null);
    setJoinCode('');
    setEnteredPassword('');
    setCurrentRoomId('');
    setListenerAudio({
      src: '',
      thumbnail: '',
      title: 'Waiting for host...',
      artist: '',
      currentTime: 0,
      volume: 0.7,
      isPlaying: false,
      senderDetails: null
    });
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1db954] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 relative">
      {/* Password Modal with Blur Background */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blur Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowPasswordModal(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-sm mx-4 bg-[#181818] rounded-2xl p-6 border border-[#282828] shadow-2xl">
            {/* Lock Icon */}
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 bg-[#1db954] rounded-full flex items-center justify-center">
                <FaLock className="text-2xl text-white" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-white text-center mb-2">
              Enter Password
            </h2>
            <p className="text-[#b3b3b3] text-center text-sm mb-5">
              Session code: <span className="text-[#1db954] font-mono font-bold">{joinCode}</span>
            </p>

            {/* Password Input */}
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                placeholder="Password"
                className="w-full bg-[#282828] text-white px-4 py-3 pr-10 rounded-lg border border-[#404040] focus:border-[#1db954] focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b3b3b3] hover:text-white"
              >
                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>

            {passwordError && (
              <p className="text-red-400 text-sm text-center mb-4">{passwordError}</p>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-2.5 rounded-full border border-[#404040] text-white hover:bg-[#282828] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                disabled={isVerifying}
                className="flex-1 py-2.5 rounded-full bg-[#1db954] text-black font-semibold hover:bg-[#1ed760] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                ) : (
                  'Join'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LISTENER VIEW - Clean & Simple */}
      {isJoined && sessionData ? (
        <div className="min-h-screen flex flex-col">
          {/* Hidden Audio Element for Listener */}
          <audio ref={audioRef} preload="metadata" />
          
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 border-b border-[#282828]">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 rounded-full">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 text-sm font-medium">LIVE</span>
              </div>
              <span className="text-[#b3b3b3] text-sm flex items-center gap-1">
                <FaUsers size={12} />
                {sessionData.listeners}
              </span>
              <span className="text-[#1db954] text-xs font-mono ml-2">
                Room: {currentRoomId}
              </span>
            </div>
            
            <button
              onClick={handleExitSession}
              className="flex items-center gap-2 px-4 py-2 bg-[#282828] hover:bg-red-500/20 text-white hover:text-red-400 rounded-full transition-colors text-sm"
            >
              <FaSignOutAlt size={12} />
              Exit
            </button>
          </div>
         
          

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
            {/* Host Info */}
            <div className="flex items-center gap-2 mb-6">
              <img 
                src={sessionData.hostAvatar} 
                alt={sessionData.hostName}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-[#b3b3b3] text-sm">{listenerAudio.senderDetails?.name || sessionData.hostName}</span>
              <FaCrown className="text-yellow-400 text-xs" />
            </div>

            {/* Album Art */}
            <div className="relative mb-6">
              <img 
                src={listenerAudio.thumbnail || sessionData.albumArt} 
                alt={sessionData.songTitle}
                className="w-64 h-64 sm:w-72 sm:h-72 rounded-2xl object-cover shadow-xl"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/400x400/1db954/ffffff?text=🎵';
                }}
              />
              {/* Playing Indicator */}
              {listenerAudio.isPlaying && (
                <div className="absolute bottom-3 right-3 flex items-end gap-0.5 h-4 bg-black/60 px-2 py-1 rounded">
                  <div className="w-1 bg-[#1db954] rounded-full animate-bounce" style={{height: '40%', animationDelay: '0ms'}}></div>
                  <div className="w-1 bg-[#1db954] rounded-full animate-bounce" style={{height: '80%', animationDelay: '150ms'}}></div>
                  <div className="w-1 bg-[#1db954] rounded-full animate-bounce" style={{height: '60%', animationDelay: '300ms'}}></div>
                  <div className="w-1 bg-[#1db954] rounded-full animate-bounce" style={{height: '100%', animationDelay: '450ms'}}></div>
                </div>
              )}
              {!listenerAudio.isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
                  <div className="text-white text-center">
                    <FaHeadphones className="text-4xl mx-auto mb-2 text-[#1db954]" />
                    <p className="text-sm">Waiting for host...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Song Info */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {listenerAudio.isPlaying ? 'Now Playing' : sessionData.songTitle}
              </h1>
              <p className="text-[#b3b3b3]">{listenerAudio.senderDetails?.name || sessionData.artist}</p>
              {listenerAudio.isPlaying && (
                <p className="text-[#1db954] text-sm mt-2">🎧 Listening to host's music</p>
              )}
            </div>

            {/* Volume Control */}
            <div className="w-full max-w-xs bg-[#181818] rounded-xl p-4 border border-[#282828]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FaVolumeUp className="text-[#1db954]" />
                  <span className="text-white text-sm">Volume</span>
                </div>
                <span className="text-[#1db954] font-bold">{Math.round(listenerAudio.volume * 100)}%</span>
              </div>
              
              <input
                type="range"
                min="0"
                max="100"
                value={listenerAudio.volume * 100}
                onChange={(e) => {
                  const newVol = Number(e.target.value) / 100;
                  setListenerAudio(prev => ({ ...prev, volume: newVol }));
                  if (audioRef.current) {
                    audioRef.current.volume = newVol;
                  }
                }}
                className="w-full h-2 bg-[#282828] rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #1db954 ${listenerAudio.volume * 100}%, #282828 ${listenerAudio.volume * 100}%)`
                }}
              />
              <p className="text-[#535353] text-xs mt-2 text-center">
                {listenerAudio.isPlaying ? '🔊 Audio synced with host' : '⏳ Waiting for audio...'}
              </p>
            </div>
          </div>

          {/* Bottom Progress */}
          <div className="h-1 bg-[#282828]">
            <div 
              className="h-full bg-[#1db954] transition-all" 
              style={{width: listenerAudio.isPlaying ? '100%' : '0%'}}
            ></div>
          </div>
        </div>
      ) : (
        /* NORMAL JOIN VIEW */
        <>
          {/* Header */}
          <div className="p-4 sm:p-6">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white hover:text-[#1db954] transition-colors mb-6"
            >
              <FaArrowLeft />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="bg-[#1db954] p-4 rounded-full">
                <FaBroadcastTower className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Broadcast Music</h1>
                <p className="text-[#b3b3b3] text-sm">Listen together with friends</p>
              </div>
            </div>
          </div>

          {/* Join Section */}
          <div className="px-4 sm:px-6 mb-8">
            <div className="bg-[#181818] rounded-xl p-5 border border-[#282828]">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaHeadphones className="text-[#1db954]" />
                Join a Session
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Enter 8-digit code"
                  maxLength={8}
                  className="flex-1 bg-[#282828] text-white px-4 py-3 rounded-lg border border-[#404040] focus:border-[#1db954] focus:outline-none uppercase tracking-widest text-center font-mono"
                />
                <button
                  onClick={handleJoinWithCode}
                  disabled={joinCode.length < 8}
                  className="bg-[#1db954] text-black px-6 py-3 rounded-full font-semibold hover:bg-[#1ed760] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="px-4 sm:px-6">
            <h2 className="text-lg font-semibold text-white mb-4">Active Sessions</h2>
            <div className="space-y-3">
              {sessions.map((session) => (
                <div 
                  key={session._id}
                  className="bg-[#181818] rounded-xl p-4 border border-[#282828] hover:border-[#1db954]/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={session.hostAvatar} 
                      alt={session.hostName}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{session.hostName}</p>
                      <p className="text-[#1db954] text-sm truncate">{session.songTitle} • {session.artist}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[#b3b3b3] text-xs flex items-center gap-1">
                        <FaUsers size={10} /> {session.listeners}
                      </span>
                      <button
                        onClick={() => {
                          setJoinCode(session.code);
                          setShowPasswordModal(true);
                        }}
                        className="px-4 py-1.5 bg-[#282828] hover:bg-[#1db954] text-white hover:text-black rounded-full text-sm font-medium transition-colors"
                      >
                        Join
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Hidden audio element for listener playback */}
      <audio ref={audioRef} hidden />
    </div>
  );
};

export default JoinFriends;
