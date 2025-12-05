import { useState } from 'react';
import { FaPlay, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SongCard = ({ song }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation(); // Prevent navigation
    if (isLiking) return;
    
    try {
      setIsLiking(true);
      await axios.post(`http://localhost:3001/api/music/likeSong/${song._id}`, {}, {
        withCredentials: true
      });
      setIsLiked(true);
    } catch (err) {
      console.error('Error liking song:', err);
      if (err.response?.status === 400) {
        // Already liked
        setIsLiked(true);
      }
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/song/${song._id}`)}
      className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all duration-300 cursor-pointer group"
    >
      <div className="relative mb-4">
        <img
          src={song.coverUrl}
          alt={song.title}
          className="w-full aspect-square object-cover rounded-md"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-[#1db954] text-black p-4 rounded-full shadow-lg hover:scale-110 transform transition-transform">
            <FaPlay className="text-xl ml-1" />
          </button>
        </div>
        
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`absolute top-2 right-2 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all ${
            isLiked 
              ? 'bg-[#1db954] text-black' 
              : 'bg-black/60 text-white hover:bg-black/80'
          }`}
        >
          <FaHeart className={`text-sm ${isLiked ? 'text-black' : ''}`} />
        </button>
      </div>
      <h3 className="text-white font-semibold text-base mb-1 truncate">
        {song.title}
      </h3>
      <p className="text-[#b3b3b3] text-sm truncate">{song.artist}</p>
    </div>
  );
};

export default SongCard;
