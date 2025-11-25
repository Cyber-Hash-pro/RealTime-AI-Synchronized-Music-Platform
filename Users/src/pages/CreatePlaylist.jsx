import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreatePlaylist = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    musics: [],
  });

  const [allMusic, setAllMusic] = useState([]);

  // ------------------------------------------------------
  // GET all music for user (User token required)
  // ------------------------------------------------------
  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get("http://localhost:3001/api/music", 
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
        "http://localhost:3001/api/music/createUserPlaylist",
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

        {/* Music Checkbox Selection */}
        <div>
          <label className="block text-white font-semibold mb-3">
            Select Songs <span className="text-[#1db954]">*</span>
          </label>

          <div className="bg-[#282828] rounded-lg p-4 max-h-80 overflow-y-auto">
            {allMusic.length === 0 ? (
              <p className="text-[#b3b3b3] text-center py-4">No songs available</p>
            ) : (
              <div className="space-y-4">
                {allMusic.map((music) => (
                  <div key={music._id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-[#383838] transition-colors">
                    <input
                      type="checkbox"
                      id={music._id}
                      checked={formData.musics.includes(music._id)}
                      onChange={(e) => {
                        const musicId = music._id;
                        let updatedMusics;
                        
                        if (e.target.checked) {
                          // Add to selection
                          updatedMusics = [...formData.musics, musicId];
                        } else {
                          // Remove from selection
                          updatedMusics = formData.musics.filter(id => id !== musicId);
                        }
                        
                        setFormData({ ...formData, musics: updatedMusics });
                        console.log("Selected songs:", updatedMusics);
                      }}
                      className="w-5 h-5 text-[#1db954] bg-[#181818] border-[#404040] rounded focus:ring-[#1db954] focus:ring-2 shrink-0"
                    />
                    
                    {/* Cover Image */}
                    <div className="w-12 h-12 shrink-0">
                      <img
                        src={music.coverUrl || music.cover || "https://placehold.co/48x48/404040/ffffff?text=♪"}
                        alt={music.title}
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/48x48/404040/ffffff?text=♪";
                        }}
                      />
                    </div>
                    
                    <label 
                      htmlFor={music._id} 
                      className="flex-1 cursor-pointer"
                    >
                      <div className="text-white hover:text-[#1db954] transition-colors">
                        <div className="font-medium text-sm leading-tight">{music.title}</div>
                        <div className="text-[#b3b3b3] text-xs mt-1">{music.artist}</div>
                      </div>
                    </label>
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
