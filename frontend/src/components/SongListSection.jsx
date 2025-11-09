import React from 'react';
import MusicCard from './MusicCard';

const SongListSection = ({ songs, onSongClick, currentSong, isPlaying }) => {
  // Fallback sample data
  const fallbackSongs = [1, 2, 3, 4].map((item) => ({
    _id: `sample-${item}`,
    title: `Daily Mix ${item}`,
    artist: 'Various Artists',
    description: 'Your favorite tracks and more',
    image: null,
    musicUrl: null
  }));

  const displaySongs = songs && songs.length > 0 ? songs : fallbackSongs;

  return (
    <div className="song-list-section">
      {displaySongs.map((song, index) => (
        <MusicCard
          key={song._id || index}
          title={song.title || 'Untitled'}
          description={song.artist || song.description || 'Unknown Artist'}
          image={song.coverUrl || song.image}
          onPlay={() => onSongClick && onSongClick(song)}
          isPlaying={isPlaying && currentSong?._id === song._id}
        />
      ))}
    </div>
  );
};

export default SongListSection;
