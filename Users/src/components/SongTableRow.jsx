import { FaPlay } from 'react-icons/fa';

const SongTableRow = ({ song, index, onClick }) => {
  return (
    <tr 
      onClick={onClick}
      className="hover:bg-[#282828] transition-colors group cursor-pointer"
    >
      <td className="py-3 px-4 text-[#b3b3b3] w-12">
        <span className="group-hover:hidden">{index + 1}</span>
        <FaPlay className="hidden group-hover:block text-white text-sm" />
      </td> 

      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <img
            src={song.coverUrl || song.cover || 'https://placehold.co/40x40/1db954/ffffff?text=♪'}
            alt={song.title}
            className="w-10 h-10 rounded object-cover"
            onError={(e) => {
              e.target.src = 'https://placehold.co/40x40/1db954/ffffff?text=♪';
            }}
          />
          <div>
            <div className="text-white font-medium">{song.title || 'Unknown Title'}</div>
            <div className="text-[#b3b3b3] text-sm">{song.artist || 'Unknown Artist'}</div>
          </div>
        </div>
      </td>

      <td className="py-3 px-4 text-[#b3b3b3]">{song.artist || 'Unknown Artist'}</td>
      <td className="py-3 px-4 text-[#b3b3b3] text-right">{song.duration || '--:--'}</td>
    </tr>
  );
};

export default SongTableRow;
