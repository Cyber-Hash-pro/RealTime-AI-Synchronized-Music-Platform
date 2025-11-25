import { useState, useEffect } from 'react';
import SongCard from '../components/SongCard';
import axios from 'axios';

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  const fetchSongs = async (skipValue = 0, loadMore = false) => {
    try {
      if (!loadMore) setLoading(true);
      
      const response = await axios.get('http://localhost:3001/api/music',{
        withCredentials: true,
      });
      // console.log(response)
      // const newSongs = response.data.musics || [];
      setSongs(response.data.musics || []);
      
      if (loadMore) {
        setSongs(prevSongs => [...prevSongs, ...newSongs]);
      } else {
        setSongs(newSongs);
      }

      // Check if there are more songs to load
      if (newSongs.length < limit) {
        setHasMore(false);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching songs:', err);
      setError('Failed to fetch songs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreSongs = () => {
    const newSkip = skip + limit;
    setSkip(newSkip);
    fetchSongs(newSkip, true);
  };

  useEffect(() => {
    fetchSongs();
    
  }, []);

  if (loading && songs.length === 0) {
    return (
      <div className="px-4 py-6 sm:p-6">
        <h1 className="text-4xl font-bold text-white mb-8">All Songs</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-white text-lg">Loading songs...</div>
        </div>
      </div>
    );
  }

  if (error && songs.length === 0) {
    return (
      <div className="px-4 py-6 sm:p-6">
        <h1 className="text-4xl font-bold text-white mb-8">All Songs</h1>
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-red-400 text-lg mb-4">{error}</div>
          <button
            onClick={() => fetchSongs()}
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
      
      {songs.length === 0 ? (
        <div className="text-center text-[#b3b3b3] py-8">
          No songs available
        </div>
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6">
            {songs.map((song) => (
              <SongCard key={song._id || song.id} song={song} />
            ))}
          </div>
          
          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMoreSongs}
                className="bg-[#1db954] text-black px-8 py-3 rounded-full hover:bg-[#1ed760] transition-colors font-semibold"
              >
                Load More Songs
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
