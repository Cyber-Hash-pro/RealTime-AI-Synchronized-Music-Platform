import React from 'react';
import { motion } from 'framer-motion';
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
  const recentUploads = [
    { id: 1, title: "Midnight Dreams", plays: "12.5k", date: "2 days ago", thumbnail: "https://picsum.photos/50/50?random=1" },
    { id: 2, title: "Neon Lights", plays: "8.2k", date: "5 days ago", thumbnail: "https://picsum.photos/50/50?random=2" },
    { id: 3, title: "Urban Jungle", plays: "5.1k", date: "1 week ago", thumbnail: "https://picsum.photos/50/50?random=3" },
  ];

  const achievements = [
    { title: "First 1K Plays", description: "Midnight Dreams reached 1,000 plays!", date: "Nov 20, 2024" },
    { title: "Top 10 Electronic", description: "Your track ranked in top 10", date: "Nov 18, 2024" },
    { title: "50 Likes Milestone", description: "Neon Lights got 50+ likes", date: "Nov 15, 2024" }
  ];

  const monthlyStats = {
    totalPlays: 45672,
    newFollowers: 234,
    tracksUploaded: 3,
    revenue: 1247
  };

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Plays" value="128.5k" icon={Play} trend="+12% this week" />
        <StatCard title="Followers" value="4,230" icon={Users} trend="+5% this week" />
        <StatCard title="Total Tracks" value="24" icon={Music} trend="+2 new tracks" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-full">
          <h2 className="text-xl font-bold text-white mb-6">Recent Uploads</h2>
          <div className="flex flex-col gap-4">
            {recentUploads.map((track) => (
              <div key={track.id} className="flex items-center justify-between p-4 bg-(--color-bg-main) rounded-lg hover:bg-(--color-card-hover) transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <img 
                    src={track.thumbnail} 
                    alt={track.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-white">{track.title}</h4>
                    <p className="text-xs text-(--color-text-secondary)">{track.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{track.plays}</p>
                  <p className="text-xs text-(--color-text-secondary)">plays</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

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
