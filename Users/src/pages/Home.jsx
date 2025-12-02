import { useEffect ,useState} from 'react';
import SongCard from '../components/SongCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMusicData } from '../Store/actions/musicaction.jsx';
import { useNavigate } from 'react-router-dom';
import socketInstance from '../socket.service.js';

const Home = () => {

  const dispatch = useDispatch();
  const { allMusic, loading, error } = useSelector((state) => state.music);
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(fetchMusicData());
    socketInstance.on('connect', () => {
        console.log('Connected to socket server');
    });
    socketInstance.on('play', (data) => {
      console.log('Play event received with data:', data);
      const musicId = data.musicId; 
    
      navigate(`/song/${musicId}`
        
      );
    });
   
    return () => {
    };

  }, [dispatch]);

  if (loading) {
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

  if (error) {
    return (
      <div className="px-4 py-6 sm:p-6">
        <h1 className="text-4xl font-bold text-white mb-8">All Songs</h1>
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-red-400 text-lg mb-4">{error}</div>
          <button
            onClick={() => dispatch(fetchMusicData())}
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

      {(!allMusic || allMusic.length === 0) ? (
        <div className="text-center text-[#b3b3b3] py-8">
          No songs available
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6">
          {allMusic.map((song) => (
            <SongCard key={song._id} song={song} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
