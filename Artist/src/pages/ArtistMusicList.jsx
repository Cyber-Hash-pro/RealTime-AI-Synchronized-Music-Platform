import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, MoreVertical, Clock, Calendar, Music, AlertCircle, RefreshCw } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';

const ArtistMusicList = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Dummy data for tracks
  const dummyTracks = [
    {
      id: 1,
      title: "Midnight Dreams",
      artist: "John Doe",
      duration: "3:45",
      uploadDate: "2024-01-15",
      genre: "Electronic",
      plays: 1250,
      thumbnail: "https://picsum.photos/300/300?random=1"
    },
    {
      id: 2,
      title: "Summer Vibes",
      artist: "John Doe", 
      duration: "4:12",
      uploadDate: "2024-01-10",
      genre: "Pop",
      plays: 850,
      thumbnail: "https://picsum.photos/300/300?random=2"
    },
    {
      id: 3,
      title: "City Lights",
      artist: "John Doe",
      duration: "3:28",
      uploadDate: "2024-01-05", 
      genre: "Indie",
      plays: 2100,
      thumbnail: "https://picsum.photos/300/300?random=3"
    }
  ];

  const fetchArtistMusic = async () => {
    try {
      setError(null);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTracks(dummyTracks);
    } catch (error) {
      console.error('Error fetching artist music:', error);
      setError('Failed to fetch your music');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchArtistMusic();
    }
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchArtistMusic();
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Unknown';
    }
  };

  const formatDuration = (durationMs) => {
    if (!durationMs) return '--:--';
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatPlays = (plays) => {
    if (!plays && plays !== 0) return '0';
    if (plays >= 1000000) {
      return (plays / 1000000).toFixed(1) + 'M';
    } else if (plays >= 1000) {
      return (plays / 1000).toFixed(1) + 'K';
    }
    return plays.toString();
  };

  const getDefaultCover = () => {
    return "https://via.placeholder.com/300x300/1a1a1a/888888?text=🎵";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--color-accent-green) mx-auto mb-4"></div>
          <p className="text-(--color-text-secondary)">Loading your music...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Music</h1>
          <p className="text-(--color-text-secondary)">
            Manage your tracks and albums • {tracks.length} track{tracks.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="secondary" 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </Button>
          <Button variant="primary" onClick={() => window.location.href='/upload'}>
            Upload New
          </Button>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span className="text-red-400 text-sm">{error}</span>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleRefresh}
            className="ml-auto"
          >
            Try Again
          </Button>
        </motion.div>
      )}

      {tracks.length === 0 && !loading ? (
        <Card className="text-center py-16">
          <div className="w-24 h-24 bg-(--color-card-hover) rounded-full flex items-center justify-center text-(--color-text-secondary) mx-auto mb-6">
            <Music size={48} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Music Yet</h3>
          <p className="text-(--color-text-secondary) mb-6 max-w-md mx-auto">
            Start building your catalog by uploading your first track. Share your music with the world!
          </p>
          <Button variant="primary" onClick={() => window.location.href='/upload'}>
            Upload Your First Track
          </Button>
        </Card>
      ) : (
        <div className="bg-(--color-bg-card) border border-(--color-border-subtle) rounded-xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-(--color-border-subtle) text-sm font-medium text-(--color-text-secondary)">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5">Title</div>
            <div className="col-span-2">Plays</div>
            <div className="col-span-2 flex items-center gap-1">
              <Calendar size={14} /> Date
            </div>
            <div className="col-span-1 flex items-center gap-1">
              <Clock size={14} /> Time
            </div>
            <div className="col-span-1"></div>
          </div>

          {/* List */}
          <div className="flex flex-col">
            {tracks.map((track, index) => (
              <div 
                key={track._id || track.id || index} 
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-(--color-card-hover) transition-colors group border-b border-(--color-border-subtle) last:border-0"
              >
                <div className="col-span-1 text-center text-(--color-text-secondary) group-hover:text-white">
                  <span className="group-hover:hidden">{index + 1}</span>
                  <button className="hidden group-hover:flex items-center justify-center w-full text-(--color-accent-green)">
                    <Play size={16} fill="currentColor" />
                  </button>
                </div>
                
                <div className="col-span-5 flex items-center gap-4">
                  <img 
                    src={track.coverImage || getDefaultCover()} 
                    alt={track.title || 'Track cover'} 
                    className="w-10 h-10 rounded object-cover bg-(--color-bg-main)"
                    onError={(e) => {
                      e.target.src = getDefaultCover();
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-white truncate">
                      {track.title || 'Untitled Track'}
                    </h4>
                    <p className="text-xs text-(--color-text-secondary) truncate">
                      {track.album || track.genre || 'Unknown Album'}
                    </p>
                  </div>
                </div>
                
                <div className="col-span-2 text-sm text-(--color-text-secondary)">
                  {formatPlays(track.playCount || track.plays || 0)}
                </div>
                
                <div className="col-span-2 text-sm text-(--color-text-secondary)">
                  {formatDate(track.createdAt || track.uploadDate)}
                </div>
                
                <div className="col-span-1 text-sm text-(--color-text-secondary)">
                  {formatDuration(track.duration)}
                </div>
                
                <div className="col-span-1 text-right">
                  <button className="text-(--color-text-secondary) hover:text-white p-2 rounded-full hover:bg-(--color-bg-main) transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ArtistMusicList;
