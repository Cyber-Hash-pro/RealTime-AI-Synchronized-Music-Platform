import React from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

const SongHeader = ({ songData, isCurrentSong, isPlaying, onPlayPause }) => {
  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8 mb-8">
      <div className="relative group">
        <img
          src={songData.coverUrl}
          alt={songData.title}
          className="w-64 h-64 sm:w-80 sm:h-80 rounded-lg shadow-2xl object-cover"
          onError={(e) => {
            e.target.src = 'https://placehold.co/300x300/1db954/ffffff?text=Music';
          }}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
          <button 
            onClick={onPlayPause}
            className="bg-[#1db954] text-black p-6 rounded-full hover:scale-110 transition-transform shadow-xl"
          >
            {isCurrentSong && isPlaying ? <FaPause className="text-2xl" /> : <FaPlay className="text-2xl ml-1" />}
          </button>
        </div>
      </div>

      <div className="text-center lg:text-left flex-1">
        <p className="text-sm font-semibold text-white/80 uppercase tracking-wide mb-2">Song</p>
        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-white leading-tight mb-4">
          {songData.title}
        </h1>
        <div className="flex items-center justify-center lg:justify-start gap-2 text-white text-lg sm:text-xl mb-6">
          <span className="font-semibold">{songData.artist}</span>
          <span>•</span>
          <span>{new Date(songData.createdAt).getFullYear()}</span>
        </div>
      </div>
    </div>
  );
};

export default SongHeader;
