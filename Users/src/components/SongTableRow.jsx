import { FaPlay, FaHeart } from 'react-icons/fa';
import { useState } from 'react';

const SongTableRow = ({ song, index }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(song.likes || 0);

  const handleLike = (e) => {
    e.stopPropagation();
    if (isLiked) {
      setLikes(prev => Math.max(0, prev - 1));
      setIsLiked(false);
      // TODO: Call API to unlike song
    } else {
      setLikes(prev => prev + 1);
      setIsLiked(true);
      // TODO: Call API to like song
    }
  };

  return (
    <tr className="hover:bg-[#282828] transition-colors group cursor-pointer">
      <td className="py-3 px-4 text-[#b3b3b3] w-12">
        <span className="group-hover:hidden">{index + 1}</span>
        <FaPlay className="hidden group-hover:block text-white text-sm" />
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <img
            src={song.cover}
            alt={song.title}
            className="w-10 h-10 rounded"
          />
          <div>
            <div className="text-white font-medium">{song.title}</div>
            <div className="text-[#b3b3b3] text-sm">{song.artist}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-[#b3b3b3]">{song.artist}</td>
      <td className="py-3 px-4 text-[#b3b3b3]">
        <div className="flex items-center gap-3">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full hover:scale-110 transition-all ${
              isLiked ? 'text-[#1db954]' : 'text-[#b3b3b3] hover:text-white'
            }`}
          >
            <FaHeart className="text-sm" />
          </button>
          <span className="text-sm">{likes > 0 ? likes : ''}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-[#b3b3b3] text-right">{song.duration}</td>
    </tr>
  );
};

export default SongTableRow;
