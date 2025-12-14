import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlay, FaPause, FaHeart, FaRandom, FaMusic } from 'react-icons/fa';
import axios from 'axios';
import { useMusicPlayer } from '../contexts/MusicContext';
import { MUSIC_API } from '../config/api';

const MoodSongs = () => {
  const { mood } = useParams();
  const navigate = useNavigate();
  const { playSong, currentSong, isPlaying, togglePlayPause } = useMusicPlayer();
  
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    fearful: '😨',
    disgusted: '🤢',
    surprised: '😲',
    neutral: '😐'
  };

  const moodColors = {
    happy: 'from-yellow-400 to-orange-500',
    sad: 'from-blue-400 to-indigo-600',
    angry: 'from-red-500 to-rose-700',
    fearful: 'from-purple-400 to-violet-600',
    disgusted: 'from-green-500 to-emerald-700',
    surprised: 'from-pink-400 to-fuchsia-600',
    neutral: 'from-gray-400 to-slate-600'
  };

  const moodMessages = {
    happy: 'Upbeat tracks to keep the good vibes going!',
    sad: 'Soothing melodies to embrace the moment.',
    angry: 'Powerful beats to channel your energy!',
    fearful: 'Calming tunes to ease your mind.',
    disgusted: 'Fresh sounds to lift your spirits.',
    surprised: 'Exciting tracks for unexpected moments!',
    neutral: 'Balanced mixes for a chill state of mind.'
  };

  useEffect(() => {
    const fetchMoodSongs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${MUSIC_API}/mood-dectect/?mood=${mood}&limit=${limit}`, {
          withCredentials: true,
        });
        console.log('Mood Songs Response:', response.data);
        
        // Check if response has musics array
        if (response.data && response.data.musics && response.data.musics.length > 0) {
          setSongs(response.data.musics);
          // Check if there might be more songs
          setHasMore(response.data.musics.length === limit);
        } else {
          // No songs available
          setSongs([]);
          setHasMore(false);
        }
      } catch (err) {
        console.error('Error fetching mood songs:', err);
        setError('Unable to load songs.');
        setSongs([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodSongs();
  }, [mood, limit]);


  const handleLoadMore = () => {
    setLimit(prevLimit => prevLimit + 10);
  };

  const handlePlaySong = (song) => {
    // If clicking the same song that's playing, toggle play/pause
    if (currentSong?._id === song._id) {
      togglePlayPause();
    } else {
      // Play new song
      playSong(song);
    }
  };

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playSong(songs[0]);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...songs].sort(() => Math.random() - 0.5);
    setSongs(shuffled);
    if (shuffled.length > 0) {
      playSong(shuffled[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#0a0a0a]">
      {/* Header with Gradient */}
      <div className={`bg-gradient-to-b ${moodColors[mood] || moodColors.neutral} to-transparent pb-24 pt-6 px-4`}>
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <button
            onClick={() => navigate('/mood-detector')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <FaArrowLeft />
            <span>Back to Detector</span>
          </button>

          {/* Mood Info */}
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 rounded-2xl bg-black/30 backdrop-blur-sm flex items-center justify-center text-6xl shadow-2xl">
              {moodEmojis[mood] || '🎵'}
            </div>
            <div>
              <p className="text-white/60 text-sm uppercase tracking-wider mb-1">
                Mood Playlist
              </p>
              <h1 className="text-5xl font-bold text-white capitalize mb-2">
                {mood} Vibes
              </h1>
              <p className="text-white/80 text-lg">
                {moodMessages[mood] || 'Songs curated just for you'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Song List */}
      <div className="max-w-4xl mx-auto px-4 -mt-12">
        {/* Action Buttons */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handlePlayAll}
            className="w-14 h-14 rounded-full bg-[#1db954] flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-[#1db954]/30"
          >
            {currentSong && songs[0]?._id === currentSong._id && isPlaying ? (
              <FaPause className="text-black text-xl" />
            ) : (
              <FaPlay className="text-black text-xl ml-1" />
            )}
          </button>
          <button
            onClick={handleShuffle}
            className="w-12 h-12 rounded-full bg-[#282828] flex items-center justify-center hover:bg-[#3e3e3e] transition-colors"
          >
            <FaRandom className="text-[#b3b3b3] text-lg" />
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-[#1db954] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[#b3b3b3]">Finding songs for your mood...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Songs Grid */}
        {!loading && songs.length > 0 && (
          <div className="space-y-2">
            {songs.map((song, index) => {
              const isCurrentSong = currentSong?._id === song._id;
              const isCurrentPlaying = isCurrentSong && isPlaying;
              
              return (
                <div
                  key={song._id}
                  onClick={() => handlePlaySong(song)}
                  className={`group flex items-center gap-4 p-3 rounded-lg hover:bg-[#282828] transition-colors cursor-pointer ${
                    isCurrentSong ? 'bg-[#282828]' : ''
                  }`}
                >
                  {/* Track Number / Play Icon */}
                  <div className="w-8 text-center">
                    {isCurrentPlaying ? (
                      <FaPause className="text-[#1db954] text-sm mx-auto" />
                    ) : (
                      <>
                        <span className={`text-[#b3b3b3] group-hover:hidden ${isCurrentSong ? 'hidden' : ''}`}>
                          {index + 1}
                        </span>
                        <FaPlay className={`text-white text-sm mx-auto hidden group-hover:block ${isCurrentSong ? '!block !text-[#1db954]' : ''}`} />
                      </>
                    )}
                  </div>

                {/* Album Art */}
                <div className="w-12 h-12 rounded overflow-hidden bg-[#282828] flex items-center justify-center flex-shrink-0">
                  {song.coverUrl ? (
                    <img 
                      src={song.coverUrl} 
                      alt={song.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-gradient-to-br ${moodColors[mood]} items-center justify-center ${song.coverUrl ? 'hidden' : 'flex'}`}>
                    <FaMusic className="text-white/80" />
                  </div>
                </div>

                {/* Song Info */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium truncate ${isCurrentSong ? 'text-[#1db954]' : 'text-white'}`}>
                    {song.title}
                  </h3>
                  <p className="text-[#b3b3b3] text-sm truncate">
                    {song.artist || song.artistName || 'Unknown Artist'}
                  </p>
                </div>

                {/* Duration */}
                <span className="text-[#b3b3b3] text-sm">
                  {song.duration || '3:00'}
                </span>

                {/* Like Button */}
                <button 
                  onClick={(e) => e.stopPropagation()}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:text-[#1db954] text-[#b3b3b3] transition-all"
                >
                  <FaHeart />
                </button>
              </div>
            );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && songs.length === 0 && (
          <div className="text-center py-20">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${moodColors[mood]} flex items-center justify-center`}>
              <div className="text-5xl">🎵</div>
            </div>
            <h3 className="text-white text-2xl font-bold mb-3">Coming Soon!</h3>
            <p className="text-[#b3b3b3] text-lg mb-2">
              Songs for {mood} mood are being uploaded
            </p>
            <p className="text-[#b3b3b3] mb-6">
              Check back soon for curated tracks matching your vibe
            </p>
            <button
              onClick={() => navigate('/mood-detector')}
              className="bg-[#1db954] text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform inline-flex items-center gap-2"
            >
              <FaArrowLeft />
              Try Another Mood
            </button>
          </div>
        )}

        {/* Load More Button */}
        {!loading && songs.length > 0 && hasMore && (
          <div className="flex justify-center mt-8 mb-6">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="bg-[#282828] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#3e3e3e] transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {loadingMore ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More Songs'
              )}
            </button>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default MoodSongs;
