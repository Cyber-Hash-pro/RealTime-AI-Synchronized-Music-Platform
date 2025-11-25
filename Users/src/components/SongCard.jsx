import { FaPlay } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SongCard = ({ song }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/song/${song.id}`)}
      className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all duration-300 cursor-pointer group"
    >
      <div className="relative mb-4">
        <img
          src={song.coverUrl}
          alt={song.title}
          className="w-full aspect-square object-cover rounded-md"
        />
        {/* Play Button - Shows on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-[#1db954] text-black p-4 rounded-full shadow-lg hover:scale-110 transform transition-transform">
            <FaPlay className="text-xl ml-1" />
          </button>
        </div>
      </div>
      <h3 className="text-white font-semibold text-base mb-1 truncate">
        {song.title}
      </h3>
      <p className="text-[#b3b3b3] text-sm truncate">{song.artist}</p>
    </div>
  );
};

export default SongCard;
