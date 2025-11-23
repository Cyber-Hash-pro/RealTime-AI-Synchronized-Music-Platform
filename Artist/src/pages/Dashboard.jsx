import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Play, TrendingUp, Users, Music } from 'lucide-react';
import Card from '../components/Card';

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <Card hover className="p-6">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-(--color-text-secondary) text-sm mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white mb-2">{value}</h3>
        <p className="text-xs text-(--color-accent-green) flex items-center gap-1">
          <TrendingUp size={12} /> {trend}
        </p>
      </div>
      <div className="w-12 h-12 bg-(--color-card-hover) rounded-full flex items-center justify-center text-(--color-accent-green)">
        <Icon size={24} />
      </div>
    </div>
  </Card>
);

const Dashboard = () => {

  // ----------------------------
  // STATE FOR RECENT UPLOADS
  // ----------------------------
  const [recentUploads, setRecentUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  // ----------------------------
  // FETCH ARTIST MUSIC
  // ----------------------------
  useEffect(() => {
    fetchArtistMusic();
  }, []);

  const fetchArtistMusic = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/music/artist-music", {
        withCredentials: true,
      });
console.log(res.data.musics.length);
      setRecentUploads(res.data.musics);
    } catch (error) {
      console.error("Error fetching artist music:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log(recentUploads.length); 

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, John!</h1>
        <p className="text-(--color-text-secondary)">Here's how your music is performing</p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Plays" value={`${recentUploads.length}`} icon={Play} trend="+12% this week" />
        <StatCard title="Followers" value="4,230" icon={Users} trend="+5% this week" />
        <StatCard title="Total Tracks" value="24" icon={Music} trend="+2 new tracks" />
      </div>

      {/* RECENT UPLOADS + ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* RECENT UPLOADS */}
        <Card className="h-full">
          <h2 className="text-xl font-bold text-white mb-6">Recent Uploads</h2>

          {loading ? (
            <p className="text-(--color-text-secondary)">Loading...</p>
          ) : recentUploads.length === 0 ? (
            <p className="text-(--color-text-secondary)">No uploads yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {recentUploads.map((track) => (
                <div
                  key={track._id}
                  className="flex items-center justify-between p-4 bg-(--color-bg-main) 
                            rounded-lg hover:bg-(--color-card-hover) 
                            transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-10 h-10 rounded object-cover"
                    />

                    <div>
                      <h4 className="font-medium text-white">{track.title}</h4>
                      <p className="text-xs text-(--color-text-secondary)">
                        {new Date(track.createdAt).toDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{track.plays || 0}</p>
                    <p className="text-xs text-(--color-text-secondary)">plays</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* ANALYTICS PLACEHOLDER */}
        <Card className="h-full flex flex-col justify-center items-center text-center p-8">
          <div className="w-16 h-16 bg-(--color-card-hover) rounded-full flex items-center justify-center text-(--color-accent-green) mb-4">
            <TrendingUp size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Analytics Coming Soon</h3>
          <p className="text-(--color-text-secondary)">Detailed insights about your audience and track performance will be available shortly.</p>
        </Card>

      </div>
    </motion.div>
  );
};

export default Dashboard;
