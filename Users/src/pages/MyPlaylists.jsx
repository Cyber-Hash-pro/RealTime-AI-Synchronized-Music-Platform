import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyPlaylists = () => {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------
  // Load User Playlists From Backend
  // ---------------------------------------------
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get(
          "http://localhost:3001/api/music/userPlaylists",
         {withCredentials:true}
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
      <div className="text-center py-20">
        <p className="text-[#b3b3b3] text-lg">Loading playlists...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">My Playlists</h1>
          <p className="text-[#b3b3b3]">Your personal collection</p>
        </div>
        <button
          onClick={() => navigate("/create-playlist")}
          className="bg-[#1db954] text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform w-full md:w-auto"
        >
          Create New Playlist
        </button>
      </div>

      {/* Playlist Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6">
        {playlists.map((playlist) => (
          <div
            key={playlist._id}
            className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all duration-300 group"
          >
            <div
              onClick={() => navigate(`/playlist/${playlist._id}`)}
              className="cursor-pointer"
            >
              <div className="relative mb-4">
                <div className="w-full aspect-square bg-[#282828] rounded-md flex items-center justify-center">
                  <p className="text-[#b3b3b3] text-sm">
                    {playlist.musics?.length || 0} Songs
                  </p>
                </div>
              </div>

              <h3 className="text-white font-semibold text-base mb-1 truncate">
                {playlist.title}
              </h3>

              <p className="text-[#b3b3b3] text-sm mb-3">
                {playlist.musics?.length || 0} songs
              </p>
            </div>

            {/* Edit + Delete */}
            <div className="flex gap-2 mt-3 pt-3 border-t border-[#282828]">
              <button
                onClick={() => handleEdit(playlist._id)}
                className="flex-1 bg-[#282828] text-white px-3 py-2 rounded-md hover:bg-[#3e3e3e] transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <FaEdit />
                Edit
              </button>

              <button
                onClick={() => handleDelete(playlist._id)}
                className="flex-1 bg-[#282828] text-[#e74c3c] px-3 py-2 rounded-md hover:bg-[#3e3e3e] transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <FaTrash />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {playlists.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[#b3b3b3] text-lg mb-4">
            You haven't created any playlists yet
          </p>
          <button
            onClick={() => navigate("/create-playlist")}
            className="bg-[#1db954] text-black px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform w-full sm:w-auto"
          >
            Create Your First Playlist
          </button>
        </div>
      )}
    </div>
  );
};

export default MyPlaylists;
