import { FaPlay, FaList } from 'react-icons/fa';

const QueueSection = ({ 
  queue, 
  showSongsList, 
  onToggleSongsList, 
  onPlaySong, 
  allMusic 
}) => {
  return (
    <div className="bg-[#181818] rounded-xl p-6 border border-[#282828]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Up Next</h2>
        <button
          onClick={onToggleSongsList}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            showSongsList ? 'bg-[#1db954] text-black' : 'bg-[#282828] text-white hover:bg-[#303030]'
          }`}
        >
          <FaList />
          {showSongsList ? 'Hide Songs' : 'Browse All'}
        </button>
      </div>
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {queue.length === 0 ? (
          <p className="text-[#b3b3b3] text-center py-4">No songs in queue - Browse and select a song to play</p>
        ) : (
          queue.map((song, index) => (
            <div 
              key={song._id || song.id}
              onClick={() => onPlaySong(song, allMusic?.findIndex(s => s._id === song._id) || 0)}
              className="flex items-center gap-4 p-3 bg-[#282828] rounded-lg hover:bg-[#303030] transition-colors cursor-pointer group"
            >
              <span className="text-[#b3b3b3] w-6 text-center group-hover:hidden">{index + 1}</span>
              <FaPlay className="text-white w-6 text-center hidden group-hover:block" />
              <img 
                src={song.coverImage || song.coverUrl || 'https://placehold.co/60x60/1db954/ffffff?text=♪'} 
                alt={song.title} 
                className="w-12 h-12 rounded-lg object-cover" 
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{song.title}</p>
                <p className="text-[#b3b3b3] text-sm truncate">{song.artist}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QueueSection;
