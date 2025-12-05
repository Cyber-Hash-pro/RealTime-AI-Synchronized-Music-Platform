import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlay, FaPause, FaHeart, FaRandom, FaMusic } from 'react-icons/fa';
import axios from 'axios';

const MoodSongs = () => {
  const { mood } = useParams();
  const navigate = useNavigate();
  
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playingId, setPlayingId] = useState(null);

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

  // Dummy songs for fallback (when API doesn't return data)
  const dummySongs = {
    happy: [
      { _id: '1', title: 'Walking on Sunshine', artist: 'Katrina & The Waves', duration: '3:54', cover: null },
      { _id: '2', title: 'Happy', artist: 'Pharrell Williams', duration: '3:53', cover: null },
      { _id: '3', title: 'Good as Hell', artist: 'Lizzo', duration: '2:39', cover: null },
      { _id: '4', title: 'Uptown Funk', artist: 'Bruno Mars', duration: '4:30', cover: null },
      { _id: '5', title: 'Can\'t Stop the Feeling', artist: 'Justin Timberlake', duration: '3:56', cover: null },
      { _id: '6', title: 'Shake It Off', artist: 'Taylor Swift', duration: '3:39', cover: null },
    ],
    sad: [
      { _id: '1', title: 'Someone Like You', artist: 'Adele', duration: '4:45', cover: null },
      { _id: '2', title: 'Fix You', artist: 'Coldplay', duration: '4:54', cover: null },
      { _id: '3', title: 'Hurt', artist: 'Johnny Cash', duration: '3:38', cover: null },
      { _id: '4', title: 'The Night We Met', artist: 'Lord Huron', duration: '3:28', cover: null },
      { _id: '5', title: 'Skinny Love', artist: 'Bon Iver', duration: '3:58', cover: null },
      { _id: '6', title: 'Mad World', artist: 'Gary Jules', duration: '3:07', cover: null },
    ],
    angry: [
      { _id: '1', title: 'Killing In The Name', artist: 'Rage Against the Machine', duration: '5:13', cover: null },
      { _id: '2', title: 'Break Stuff', artist: 'Limp Bizkit', duration: '2:46', cover: null },
      { _id: '3', title: 'Bodies', artist: 'Drowning Pool', duration: '3:24', cover: null },
      { _id: '4', title: 'Chop Suey!', artist: 'System of a Down', duration: '3:30', cover: null },
      { _id: '5', title: 'Given Up', artist: 'Linkin Park', duration: '3:09', cover: null },
      { _id: '6', title: 'Bulls on Parade', artist: 'RATM', duration: '3:52', cover: null },
    ],
    fearful: [
      { _id: '1', title: 'Breathe Me', artist: 'Sia', duration: '4:34', cover: null },
      { _id: '2', title: 'Weightless', artist: 'Marconi Union', duration: '8:09', cover: null },
      { _id: '3', title: 'Clair de Lune', artist: 'Debussy', duration: '5:12', cover: null },
      { _id: '4', title: 'River Flows in You', artist: 'Yiruma', duration: '3:35', cover: null },
      { _id: '5', title: 'Sunset Lover', artist: 'Petit Biscuit', duration: '3:25', cover: null },
      { _id: '6', title: 'Safe and Sound', artist: 'Capital Cities', duration: '3:14', cover: null },
    ],
    disgusted: [
      { _id: '1', title: 'Good Vibrations', artist: 'Beach Boys', duration: '3:39', cover: null },
      { _id: '2', title: 'Three Little Birds', artist: 'Bob Marley', duration: '3:00', cover: null },
      { _id: '3', title: 'Here Comes the Sun', artist: 'The Beatles', duration: '3:05', cover: null },
      { _id: '4', title: 'Island in the Sun', artist: 'Weezer', duration: '3:20', cover: null },
      { _id: '5', title: 'Lovely Day', artist: 'Bill Withers', duration: '4:15', cover: null },
      { _id: '6', title: 'Don\'t Worry Be Happy', artist: 'Bobby McFerrin', duration: '4:50', cover: null },
    ],
    surprised: [
      { _id: '1', title: 'Wow.', artist: 'Post Malone', duration: '2:29', cover: null },
      { _id: '2', title: 'Thunder', artist: 'Imagine Dragons', duration: '3:07', cover: null },
      { _id: '3', title: 'Bohemian Rhapsody', artist: 'Queen', duration: '5:55', cover: null },
      { _id: '4', title: 'Crazy', artist: 'Gnarls Barkley', duration: '2:58', cover: null },
      { _id: '5', title: 'Take On Me', artist: 'a-ha', duration: '3:46', cover: null },
      { _id: '6', title: 'Somebody That I Used to Know', artist: 'Gotye', duration: '4:04', cover: null },
    ],
    neutral: [
      { _id: '1', title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:20', cover: null },
      { _id: '2', title: 'Levitating', artist: 'Dua Lipa', duration: '3:23', cover: null },
      { _id: '3', title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', duration: '2:21', cover: null },
      { _id: '4', title: 'Watermelon Sugar', artist: 'Harry Styles', duration: '2:54', cover: null },
      { _id: '5', title: 'drivers license', artist: 'Olivia Rodrigo', duration: '4:02', cover: null },
      { _id: '6', title: 'Peaches', artist: 'Justin Bieber', duration: '3:18', cover: null },
    ]
  };

  useEffect(() => {
    const fetchMoodSongs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3001/api/music/mood-dector/${mood}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.length > 0) {
          setSongs(response.data);
        } else {
          // Use dummy songs if API returns empty
          setSongs(dummySongs[mood] || dummySongs.neutral);
        }
      } catch (err) {
        console.error('Error fetching mood songs:', err);
        // Use dummy songs on error
        setSongs(dummySongs[mood] || dummySongs.neutral);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodSongs();
  }, [mood]);

  const handlePlaySong = (songId) => {
    if (playingId === songId) {
      setPlayingId(null);
    } else {
      setPlayingId(songId);
      // Navigate to song details if it's a real song
      if (songs[0]?.musicUrl) {
        navigate(`/song/${songId}`);
      }
    }
  };

  const handleShuffle = () => {
    const shuffled = [...songs].sort(() => Math.random() - 0.5);
    setSongs(shuffled);
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
            onClick={() => songs.length > 0 && handlePlaySong(songs[0]._id)}
            className="w-14 h-14 rounded-full bg-[#1db954] flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-[#1db954]/30"
          >
            <FaPlay className="text-black text-xl ml-1" />
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
            {songs.map((song, index) => (
              <div
                key={song._id}
                onClick={() => handlePlaySong(song._id)}
                className={`group flex items-center gap-4 p-3 rounded-lg hover:bg-[#282828] transition-colors cursor-pointer ${
                  playingId === song._id ? 'bg-[#282828]' : ''
                }`}
              >
                {/* Track Number / Play Icon */}
                <div className="w-8 text-center">
                  <span className={`text-[#b3b3b3] group-hover:hidden ${playingId === song._id ? 'hidden' : ''}`}>
                    {index + 1}
                  </span>
                  <FaPlay className={`text-white text-sm mx-auto hidden group-hover:block ${playingId === song._id ? '!block' : ''}`} />
                </div>

                {/* Album Art */}
                <div className={`w-12 h-12 rounded bg-gradient-to-br ${moodColors[mood]} flex items-center justify-center flex-shrink-0`}>
                  {song.cover ? (
                    <img 
                      src={song.cover} 
                      alt={song.title} 
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <FaMusic className="text-white/80" />
                  )}
                </div>

                {/* Song Info */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium truncate ${playingId === song._id ? 'text-[#1db954]' : 'text-white'}`}>
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
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && songs.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-white text-xl font-semibold mb-2">No songs found</h3>
            <p className="text-[#b3b3b3]">We couldn't find songs for this mood yet.</p>
            <button
              onClick={() => navigate('/mood-detector')}
              className="mt-6 bg-[#1db954] text-black font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform"
            >
              Try Another Mood
            </button>
          </div>
        )}

        {/* Detect Again Section */}
        <div className="mt-12 mb-8 p-6 bg-[#181818] rounded-2xl text-center">
          <p className="text-[#b3b3b3] mb-4">Want to try detecting your mood again?</p>
          <button
            onClick={() => navigate('/mood-detector')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform"
          >
            🎭 Detect Mood Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodSongs;
