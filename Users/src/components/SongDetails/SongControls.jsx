import React from 'react';
import { FaPlay, FaPause, FaHeart, FaShare, FaRandom, FaRedo } from 'react-icons/fa';

const SongControls = ({ isCurrentSong, isPlaying, isLiked, onPlayPause, onLike }) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      <button 
        onClick={onPlayPause}
        className="bg-[#1db954] text-black px-8 py-4 rounded-full font-bold hover:scale-105 hover:bg-[#1ed760] transition-all flex items-center gap-3 text-lg shadow-xl"
      >
        {isCurrentSong && isPlaying ? <FaPause className="text-xl" /> : <FaPlay className="text-xl" />}
        <span>{isCurrentSong && isPlaying ? 'Pause' : 'Play'}</span>
      </button>
      
      <button 
        onClick={onLike}
        className={`p-4 rounded-full border-2 transition-all ${
          isLiked 
            ? 'bg-[#1db954] border-[#1db954] text-black' 
            : 'border-[#7f7f7f] text-white hover:border-white hover:scale-105'
        }`}
      >
        <FaHeart className="text-xl" />
      </button>
      
      <button className="p-4 rounded-full border-2 border-[#7f7f7f] text-white hover:border-white hover:scale-105 transition-all">
        <FaShare className="text-xl" />
      </button>
      
      <button className="p-4 rounded-full border-2 border-[#7f7f7f] text-white hover:border-white hover:scale-105 transition-all">
        <FaRandom className="text-xl" />
      </button>
      
      <button className="p-4 rounded-full border-2 border-[#7f7f7f] text-white hover:border-white hover:scale-105 transition-all">
        <FaRedo className="text-xl" />
      </button>
    </div>
  );
};

export default SongControls;
