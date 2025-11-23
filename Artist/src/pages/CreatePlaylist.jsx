import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import axios from "axios";

const CreatePlaylist = () => {
  const [title, setTitle] = useState("");
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [artistTracks, setArtistTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real uploaded tracks of artist
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/music/artist-music",
          { withCredentials: true }
        );
        setArtistTracks(res.data.musics || []);
      } catch (err) {
        console.error("Error fetching artist music:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  const toggleTrack = (id) => {
    if (selectedTracks.includes(id)) {
      setSelectedTracks(selectedTracks.filter((tid) => tid !== id));
    } else {
      setSelectedTracks([...selectedTracks, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3001/api/music/playlist",
        { title, musics: selectedTracks },
        { withCredentials: true }
      );

      alert("Playlist created successfully!");
      console.log("Playlist:", res.data);

      setTitle("");
      setSelectedTracks([]);

    } catch (error) {
      console.error("Error creating playlist:", error);
      alert("Error creating playlist");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create Playlist</h1>
        <p className="text-(--color-text-secondary)">
          Curate a collection of your best tracks
        </p>
      </div>

      {/* Playlist Form */}
      <form onSubmit={handleSubmit}>
        <Card className="mb-8">
          <div className="flex flex-col gap-6">

            <Input
              label="Playlist Title"
              placeholder="My Awesome Playlist"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* TRACK SELECTOR */}
            <div>
              <label className="text-sm font-medium text-(--color-text-secondary) mb-3 block">
                Select Tracks
              </label>

              <div className="border border-(--color-border-subtle) rounded-xl overflow-hidden">
                {loading ? (
                  <p className="text-gray-400 text-center p-4">
                    Loading your tracks...
                  </p>
                ) : artistTracks.length === 0 ? (
                  <p className="text-gray-400 text-center p-4">
                    No uploaded music found.
                  </p>
                ) : (
                  artistTracks.map((track) => {
                    const isSelected = selectedTracks.includes(track._id);

                    return (
                      <div
                        key={track._id}
                        onClick={() => toggleTrack(track._id)}
                        className={`flex items-center justify-between p-4 cursor-pointer transition-colors border-b border-(--color-border-subtle) last:border-0 ${
                          isSelected
                            ? "bg-(--color-accent-green)/10"
                            : "hover:bg-(--color-card-hover)"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                              isSelected
                                ? "bg-(--color-accent-green) border-(--color-accent-green)"
                                : "border-(--color-text-secondary)"
                            }`}
                          >
                            {isSelected && <Check size={12} className="text-black" />}
                          </div>

                          <div className="flex items-center gap-3">
                            <img
                              src={track.coverImage}
                              alt={track.title}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <div>
                              <span
                                className={`font-medium ${
                                  isSelected
                                    ? "text-(--color-accent-green)"
                                    : "text-white"
                                }`}
                              >
                                {track.title}
                              </span>
                              <div className="text-xs text-(--color-text-secondary)">
                                {track.artist} • {track.duration || "Unknown"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={!title || selectedTracks.length === 0}
              >
                Create Playlist
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </motion.div>
  );
};

export default CreatePlaylist;
