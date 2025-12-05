import { useEffect, useState } from "react";
import { FaMusic, FaPlay, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyPlaylists = () => {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  // ---------------------------------------------
  // Load User Playlists From Backend
  // ---------------------------------------------
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3001/api/music/userPlaylists",
          { withCredentials: true }
        );

        setPlaylists(data?.playlists || []);
      } catch (error) {
        console.log("Error fetching playlists", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  // ---------------------------------------------
  // Edit Playlist (Future Feature)
  // ---------------------------------------------
  const handleEdit = (id) => {
    navigate(`/playlist/edit/${id}`);
  };

  // ---------------------------------------------
  // Delete Playlist (Optional API Placeholder)
  // ---------------------------------------------
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this playlist?"
    );

    if (!confirmDelete) return;

    alert("Delete API not implemented yet on backend!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1db954] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your playlists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">My Playlists</h1>
          <p className="text-[#b3b3b3] text-lg">
            {playlists.length} playlist{playlists.length !== 1 ? 's' : ''} in your collection
          </p>
        </div>
        <button
          onClick={() => navigate("/create-playlist")}
          className="flex items-center justify-center gap-2 bg-[#1db954] text-black px-6 py-3 rounded-full font-bold hover:scale-105 hover:bg-[#1ed760] transition-all shadow-lg shadow-[#1db954]/20 w-full md:w-auto"
        >
          <FaPlus />
          Create New Playlist
        </button>
      </div>

      {/* Playlist Grid */}
      {playlists.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {playlists.map((playlist) => (
            <div
              key={playlist._id}
              onClick={() => navigate(`/user-playlist/${playlist._id}`)}
              onMouseEnter={() => setHoveredId(playlist._id)}
              onMouseLeave={() => setHoveredId(null)}
              className="bg-[#181818] p-4 rounded-xl hover:bg-[#282828] transition-all duration-300 cursor-pointer group"
            >
              {/* Playlist Cover */}
              <div className="relative mb-4">
                <div className="w-full aspect-square bg-gradient-to-br from-[#1db954] to-[#191414] rounded-lg flex items-center justify-center overflow-hidden shadow-lg">
                  {playlist.musics?.length > 0 ? (
                    <div className="grid grid-cols-2 w-full h-full">
                      {[0, 1, 2, 3].map((idx) => (
                        <div key={idx} className="w-full h-full bg-[#282828] flex items-center justify-center">
                          <FaMusic className="text-[#b3b3b3] text-lg" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <FaMusic className="text-white/80 text-5xl" />
                  )}
                </div>

                {/* Play Button Overlay */}
                <div
                  className={`absolute bottom-2 right-2 w-12 h-12 bg-[#1db954] rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
                    hoveredId === playlist._id
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-2'
                  }`}
                >
                  <FaPlay className="text-black text-lg ml-0.5" />
                </div>
              </div>

              {/* Playlist Info */}
              <h3 className="text-white font-bold text-base mb-1 truncate group-hover:text-[#1db954] transition-colors">
                {playlist.title}
              </h3>
              <p className="text-[#b3b3b3] text-sm">
                {playlist.musics?.length || 0} song{(playlist.musics?.length || 0) !== 1 ? 's' : ''}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {playlists.length === 0 && (
        <div className="text-center py-20">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-[#282828] flex items-center justify-center">
            <FaMusic className="text-5xl text-[#b3b3b3]" />
          </div>
          <h3 className="text-white text-2xl font-bold mb-2">No playlists yet</h3>
          <p className="text-[#b3b3b3] text-lg mb-6 max-w-md mx-auto">
            Create your first playlist and start organizing your favorite songs
          </p>
          <button
            onClick={() => navigate("/create-playlist")}
            className="flex items-center gap-2 bg-[#1db954] text-black px-8 py-4 rounded-full font-bold hover:scale-105 hover:bg-[#1ed760] transition-all mx-auto"
          >
            <FaPlus />
            Create Your First Playlist
          </button>
        </div>
      )}
    </div>
  );
};

export default MyPlaylists;
