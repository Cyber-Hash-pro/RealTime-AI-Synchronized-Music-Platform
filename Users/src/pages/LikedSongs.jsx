import { FaHeart } from 'react-icons/fa';
import SongCard from '../components/SongCard';

// Dummy liked songs data
const likedSongs = [
  {
    id: 101,
    title: "Blinding Lights",
    artist: "The Weeknd",
    cover: "https://i.scdn.co/image/ab67616d0000b273c4f0b3db0ab1a00e1a6bb85c",
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273c4f0b3db0ab1a00e1a6bb85c",
    duration: "3:22",
    likes: 1247
  },
  {
    id: 102,
    title: "Stay",
    artist: "The Kid LAROI & Justin Bieber",
    cover: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
    duration: "2:21",
    likes: 987
  },
  {
    id: 103,
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    cover: "https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a",
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a",
    duration: "2:58",
    likes: 856
  },
  {
    id: 104,
    title: "Levitating",
    artist: "Dua Lipa",
    cover: "https://i.scdn.co/image/ab67616d0000b273f056d74a8adf73bb6b533604",
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273f056d74a8adf73bb6b533604",
    duration: "3:23",
    likes: 1143
  },
  {
    id: 105,
    title: "Peaches",
    artist: "Justin Bieber ft. Daniel Caesar & Giveon",
    cover: "https://i.scdn.co/image/ab67616d0000b273cd945b4e3de57edd28481a3f",
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273cd945b4e3de57edd28481a3f",
    duration: "3:18",
    likes: 742
  },
  {
    id: 106,
    title: "Industry Baby",
    artist: "Lil Nas X & Jack Harlow",
    cover: "https://i.scdn.co/image/ab67616d0000b273986b8b3a64fb94e5b08e84df",
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273986b8b3a64fb94e5b08e84df",
    duration: "3:32",
    likes: 923
  },
  {
    id: 107,
    title: "Heat Waves",
    artist: "Glass Animals",
    cover: "https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5",
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5",
    duration: "3:58",
    likes: 645
  },
  {
    id: 108,
    title: "Bad Habits",
    artist: "Ed Sheeran",
    cover: "https://i.scdn.co/image/ab67616d0000b273fb9108286e25f4dccb8a6482",
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273fb9108286e25f4dccb8a6482",
    duration: "3:51",
    likes: 598
  }
];

const LikedSongs = () => {
  return (
    <div className="px-4 py-6 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
        <div className="w-48 h-48 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center shadow-xl">
          <FaHeart className="text-white text-6xl" />
        </div>
        <div className="text-center sm:text-left">
          <p className="text-sm font-semibold text-white/80 uppercase tracking-wide mb-2">Playlist</p>
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4">Liked Songs</h1>
          <p className="text-white/90 text-lg">
            {likedSongs.length} songs • Total likes: {likedSongs.reduce((sum, song) => sum + song.likes, 0)}
          </p>
        </div>
      </div>

      {/* Songs Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6">
        {likedSongs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>

      {/* Empty State - Show when no liked songs */}
      {likedSongs.length === 0 && (
        <div className="text-center py-16">
          <FaHeart className="text-6xl text-[#b3b3b3] mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Songs you like will appear here</h3>
          <p className="text-[#b3b3b3] text-lg">
            Save songs by tapping the heart icon.
          </p>
        </div>
      )}
    </div>
  );
};

export default LikedSongs;