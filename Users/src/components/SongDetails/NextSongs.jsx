import React from 'react';
import SongCard from '../SongCard';

const NextSongs = ({ allSongs }) => {
  return (
    <div className="mb-8">
      <h2 className="text-white text-2xl font-bold mb-6">Next Songs</h2>
      
      {allSongs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allSongs.map((song) => (
            <SongCard key={song._id} song={song} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-[#b3b3b3] text-lg">No more songs available</p>
        </div>
      )}
    </div>
  );
};

export default NextSongs;
