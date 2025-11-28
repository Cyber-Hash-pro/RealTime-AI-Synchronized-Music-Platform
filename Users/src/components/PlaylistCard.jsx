import { FaPlay } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PlaylistCard = ({ playlist }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/playlist/${playlist._id}`)}
      className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all duration-300 cursor-pointer group"
    >

      <div className="relative mb-4">
        <img
          src={playlist.cover}
          alt={playlist.title}
          className="w-full aspect-square object-cover rounded-md"
        />
        {/* Play Button - Shows on hover with float-up effect */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button className="bg-[#1db954] text-black p-3 rounded-full shadow-2xl hover:scale-110 transform transition-transform">
            <FaPlay className="text-lg ml-1" />
          </button>
        </div>
      </div>
      <h3 className="text-white font-semibold text-base mb-1 truncate">
        {playlist.title}
      </h3>
      <p className="text-[#b3b3b3] text-sm">
        By {playlist.artist} • {playlist.songCount} songs
      </p>
    </div>
  );
};

export default PlaylistCard;
