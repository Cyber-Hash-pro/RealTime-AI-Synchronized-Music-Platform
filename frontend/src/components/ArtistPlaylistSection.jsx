import React from 'react';
import MusicCard from './MusicCard';

const ArtistPlaylistSection = ({ artists, onArtistClick }) => {
  return (
    <div className="artist-playlist-section">
      {artists && artists.length > 0 ? (
        artists.map((artist) => (
          <MusicCard
            key={artist._id}
            title={artist.name || artist.title}
            description={`${artist.songCount || 0} songs`}
            image={artist.image || artist.coverUrl}
            onPlay={() => onArtistClick && onArtistClick(artist)}
            isPlaying={false}
          />
        ))
      ) : (
        <p style={{ color: 'var(--text-secondary)' }}>No artists available</p>
      )}
    </div>
  );
};

export default ArtistPlaylistSection;
