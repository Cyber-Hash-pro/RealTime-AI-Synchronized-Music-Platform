import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Music, Check } from 'lucide-react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

const CreatePlaylist = () => {
  const [title, setTitle] = useState('');
  const [selectedTracks, setSelectedTracks] = useState([]);

  // Mock tracks available to add
  const availableTracks = [
    { id: 1, title: "Midnight Dreams", duration: "3:45", thumbnail: "https://picsum.photos/50/50?random=1", plays: 1250 },
    { id: 2, title: "Neon Lights", duration: "2:50", thumbnail: "https://picsum.photos/50/50?random=2", plays: 850 },
    { id: 3, title: "Urban Jungle", duration: "4:12", thumbnail: "https://picsum.photos/50/50?random=3", plays: 2100 },
    { id: 4, title: "Ocean Waves", duration: "3:30", thumbnail: "https://picsum.photos/50/50?random=4", plays: 1680 },
    { id: 5, title: "Mountain High", duration: "3:15", thumbnail: "https://picsum.photos/50/50?random=5", plays: 945 },
    { id: 6, title: "City Lights", duration: "4:05", thumbnail: "https://picsum.photos/50/50?random=6", plays: 1420 },
    { id: 7, title: "Desert Wind", duration: "3:52", thumbnail: "https://picsum.photos/50/50?random=7", plays: 1120 },
    { id: 8, title: "Forest Path", duration: "2:38", thumbnail: "https://picsum.photos/50/50?random=8", plays: 780 },
  ];

  // Existing playlists
  const [existingPlaylists] = useState([
    { id: 1, name: "My Favorites", trackCount: 8, duration: "28:45", description: "Collection of my best tracks" },
    { id: 2, name: "Electronic Vibes", trackCount: 12, duration: "45:30", description: "Electronic and synth-heavy tracks" },
    { id: 3, name: "Chill Sessions", trackCount: 6, duration: "22:15", description: "Perfect for relaxing" }
  ]);

  const toggleTrack = (id) => {
    if (selectedTracks.includes(id)) {
      setSelectedTracks(selectedTracks.filter(trackId => trackId !== id));
    } else {
      setSelectedTracks([...selectedTracks, id]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Creating playlist:", { title, tracks: selectedTracks });
    alert("Playlist created successfully!");
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
        <p className="text-(--color-text-secondary)">Curate a collection of your best tracks</p>
      </div>

      {/* Existing Playlists */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Your Playlists</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {existingPlaylists.map((playlist) => (
            <Card key={playlist.id} className="p-4 hover:bg-(--color-card-hover) transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-(--color-accent-green) rounded-lg flex items-center justify-center text-black font-bold">
                  {playlist.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">{playlist.name}</h3>
                  <p className="text-xs text-(--color-text-secondary)">{playlist.trackCount} tracks • {playlist.duration}</p>
                </div>
              </div>
              <p className="text-xs text-(--color-text-secondary) mt-2 line-clamp-2">{playlist.description}</p>
            </Card>
          ))}
        </div>
      </div>

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
            
            <div>
              <label className="text-sm font-medium text-(--color-text-secondary) mb-3 block">Select Tracks</label>
              <div className="border border-(--color-border-subtle) rounded-xl overflow-hidden">
                {availableTracks.map((track) => {
                  const isSelected = selectedTracks.includes(track.id);
                  return (
                    <div 
                      key={track.id}
                      onClick={() => toggleTrack(track.id)}
                      className={`flex items-center justify-between p-4 cursor-pointer transition-colors border-b border-(--color-border-subtle) last:border-0 ${
                        isSelected ? 'bg-(--color-accent-green)/10' : 'hover:bg-(--color-card-hover)'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          isSelected 
                            ? 'bg-(--color-accent-green) border-(--color-accent-green)' 
                            : 'border-(--color-text-secondary)'
                        }`}>
                          {isSelected && <Check size={12} className="text-black" />}
                        </div>
                        <div className="flex items-center gap-3">
                          <img 
                            src={track.thumbnail}
                            alt={track.title}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <div>
                            <span className={`font-medium ${isSelected ? 'text-(--color-accent-green)' : 'text-white'}`}>
                              {track.title}
                            </span>
                            <div className="text-xs text-(--color-text-secondary)">
                              {track.plays.toLocaleString()} plays
                            </div>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-(--color-text-secondary)">{track.duration}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" variant="primary" disabled={!title || selectedTracks.length === 0}>
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
