import { useState, useEffect } from 'react';
import SongCard from '../components/SongCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMusicData } from '../Store/actions/musicaction.jsx';
const Home = () => {
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const loadSongs = async () => {
    try {
      setLoading(true);
       dispatch(fetchMusicData());
      setError(null);
    } catch (err) {
      console.error('Error fetching songs:', err);
      setError('Failed to fetch songs. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const { allMusic } = useSelector((state) => state.music);
  console.log(allMusic)
  
  useEffect(() => {
    loadSongs();
  }, [dispatch]);

  if (loading && (!allMusic || allMusic.length === 0)) {
    return (
      <div className="px-4 py-6 sm:p-6">
        <h1 className="text-4xl font-bold text-white mb-8">All Songs</h1>
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-[#1db954] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading songs...</div>
        </div>
      </div>
    );
  }

  if (error && (!allMusic || allMusic.length === 0)) {
    return (
      <div className="px-4 py-6 sm:p-6">
        <h1 className="text-4xl font-bold text-white mb-8">All Songs</h1>
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-red-400 text-lg mb-4">{error}</div>
          <button
            onClick={loadSongs}
            className="bg-[#1db954] text-black px-6 py-2 rounded-full hover:bg-[#1ed760] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:p-6">
      <h1 className="text-4xl font-bold text-white mb-8">All Songs</h1>
      
      {!allMusic || allMusic.length === 0 ? (
        <div className="text-center text-[#b3b3b3] py-8">
          No songs available
        </div>
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6">
            {allMusic.map((song) => (
              <SongCard key={song._id } song={song} />
            ))}
          </div>
          
          {/* Load More Button - Future Implementation */}
          {allMusic.length > 0 && allMusic.length % 10 === 0 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadSongs}
                disabled={loading}
                className="bg-[#1db954] text-black px-8 py-3 rounded-full hover:bg-[#1ed760] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {loading ? 'Loading...' : 'Load More Songs'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
