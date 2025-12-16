import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MUSIC_API } from '../config/api';
import { FaSearch, FaTimes, FaPlus } from 'react-icons/fa';

const CreatePlaylist = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    musics: [],
  });

  const [allMusic, setAllMusic] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // ------------------------------------------------------
  // GET all music for user (User token required)
  // ------------------------------------------------------
  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get(`${MUSIC_API}`, 
          {withCredentials:true}
        );
        
        console.log(data.musics);
        setAllMusic(data?.musics || []);
      } catch (error) {
        console.log("Error loading music:", error);
      }
    };

    fetchMusic();
  }, []);

  // ------------------------------------------------------
  // SEARCH songs API
  // ------------------------------------------------------
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      setIsSearching(true);
      setShowSearchResults(true);
      const { data } = await axios.get(`${MUSIC_API}/search/${encodeURIComponent(query)}`, {
        withCredentials: true
      });
      setSearchResults(data.musics || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const addSongToPlaylist = (song) => {
    if (!formData.musics.includes(song._id)) {
      setFormData({ ...formData, musics: [...formData.musics, song._id] });
      // Also add to allMusic if not present (for display in selected list)
      if (!allMusic.find(m => m._id === song._id)) {
        setAllMusic([...allMusic, song]);
      }
    }
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const removeSongFromPlaylist = (songId) => {
    setFormData({ 
      ...formData, 
      musics: formData.musics.filter(id => id !== songId) 
    });
  };

  // Get selected songs data
  const selectedSongsData = allMusic.filter(music => formData.musics.includes(music._id));

  // ------------------------------------------------------
  // CREATE Playlist API call using AXIOS
  // ------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Console log the form data before submission
    console.log("=== PLAYLIST CREATION DATA ===");
    console.log("Title:", formData.title);
    console.log("Selected Music IDs:", formData.musics);
    console.log("Number of songs:", formData.musics.length);
    console.log("Full form data:", formData);
    
    // Get selected song details for logging
    const selectedSongs = allMusic.filter(music => formData.musics.includes(music._id));
    console.log("Selected songs details:", selectedSongs.map(song => ({
      id: song._id,
      title: song.title,
      artist: song.artist
    })));
    console.log("===============================");

    try {
      const token = localStorage.getItem("token");

      const body = {
        title: formData.title,
        musics: formData.musics,
      };

      console.log("Sending to API:", body);

      const res = await axios.post(
        `${MUSIC_API}/createUserPlaylist`,
        body,
        
        {withCredentials:true}
      );

      console.log("API Response:", res.data);
      alert("Playlist created successfully!");
      navigate("/my-playlists");
    } catch (error) {
      console.log("Error creating playlist:", error);

      let msg =
        error.response?.data?.message ||
        "Something went wrong while creating the playlist";

      alert(msg);
    }
  };

  return (
    <div className="px-4 py-6 md:p-6 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-8">Create New Playlist</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[#181818] rounded-lg p-6 md:p-8 space-y-6"
      >
        {/* Title Input */}
        <div>
          <label className="block text-white font-semibold mb-3">
            Playlist Title <span className="text-[#1db954]">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="My Awesome Playlist"
            required
            className="w-full bg-[#282828] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1db954] placeholder-[#b3b3b3]"
          />
        </div>

        {/* Search Songs */}
        <div>
          <label className="block text-white font-semibold mb-3">
            Search & Add Songs <span className="text-[#1db954]">*</span>
          </label>

          <div className="relative mb-4">
            <div className="flex items-center bg-[#282828] rounded-lg px-4 py-3">
              <FaSearch className="text-[#b3b3b3] mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for songs to add..."
                className="flex-1 bg-transparent text-white focus:outline-none placeholder-[#b3b3b3]"
              />
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#282828] rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-[#b3b3b3]">Searching...</div>
                ) : searchResults.length === 0 ? (
                  <div className="p-4 text-center text-[#b3b3b3]">No songs found</div>
                ) : (
                  searchResults.map((song) => (
                    <div
                      key={song._id}
                      onClick={() => addSongToPlaylist(song)}
                      className="flex items-center space-x-3 p-3 hover:bg-[#383838] cursor-pointer transition-colors"
                    >
                      <img
                        src={song.coverUrl || song.cover || "https://placehold.co/40x40/404040/ffffff?text=♪"}
                        alt={song.title}
                        className="w-10 h-10 object-cover rounded"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/40x40/404040/ffffff?text=♪";
                        }}
                      />
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">{song.title}</div>
                        <div className="text-[#b3b3b3] text-xs">{song.artist}</div>
                      </div>
                      {formData.musics.includes(song._id) ? (
                        <span className="text-[#1db954] text-xs">Added</span>
                      ) : (
                        <FaPlus className="text-[#1db954]" />
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Selected Songs */}
          <div className="bg-[#282828] rounded-lg p-4 max-h-80 overflow-y-auto">
            <div className="text-[#b3b3b3] text-sm mb-3">
              Selected Songs ({selectedSongsData.length})
            </div>
            {selectedSongsData.length === 0 ? (
              <p className="text-[#b3b3b3] text-center py-4">No songs selected. Search and add songs above.</p>
            ) : (
              <div className="space-y-2">
                {selectedSongsData.map((music) => (
                  <div key={music._id} className="flex items-center space-x-3 p-3 rounded-lg bg-[#181818] hover:bg-[#222] transition-colors">
                    <img
                      src={music.coverUrl || music.cover || "https://placehold.co/40x40/404040/ffffff?text=♪"}
                      alt={music.title}
                      className="w-10 h-10 object-cover rounded"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/40x40/404040/ffffff?text=♪";
                      }}
                    />
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{music.title}</div>
                      <div className="text-[#b3b3b3] text-xs">{music.artist}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSongFromPlaylist(music._id)}
                      className="text-red-500 hover:text-red-400 p-1"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="text-[#b3b3b3] text-sm mt-2">
            Selected: {formData.musics.length} song{formData.musics.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Description */}
       
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <button
            type="submit"
            className="bg-[#1db954] text-black px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
          >
            Create Playlist
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-[#282828] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#3e3e3e] transition-colors text-center"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePlaylist;
