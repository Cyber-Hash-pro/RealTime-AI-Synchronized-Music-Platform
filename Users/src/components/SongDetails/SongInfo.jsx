import React from 'react';

const SongInfo = ({ songData, isCurrentSong, duration, formatTime }) => {
  return (
    <div className="bg-[#181818] rounded-lg p-6 mb-8">
      <h3 className="text-white text-xl font-bold mb-4">About this song</h3>
      <div className="space-y-3 text-[#b3b3b3]">
        <p><span className="text-white font-medium">Artist:</span> {songData.artist}</p>
        <p><span className="text-white font-medium">Release Date:</span> {new Date(songData.createdAt).toLocaleDateString()}</p>
        <p><span className="text-white font-medium">Duration:</span> {isCurrentSong ? formatTime(duration) : 'Unknown'}</p>
        <p><span className="text-white font-medium">File Format:</span> MP3</p>
      </div>
    </div>
  );
};

export default SongInfo;
