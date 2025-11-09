import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './SongPlayer.css';

const SongPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { musicdata } = useSelector(state => state.music);
  const [song, setSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (musicdata && id) {
      const foundSong = musicdata.find(s => s._id === id);
      if (foundSong) {
        setSong(foundSong);
        // Auto-play when song loads
        if (audioRef.current && foundSong.musicUrl) {
          audioRef.current.src = foundSong.musicUrl;
          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(error => console.error('Error playing audio:', error));
        }
      }
    }
  }, [id, musicdata]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(error => console.error('Error playing audio:', error));
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!song) {
    return (
      <div className="song-player-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="song-player-container">
      {/* Audio Element */}
      <audio 
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      {/* Back Button */}
      <button className="back-button-player" onClick={handleBack}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
        <span>Back</span>
      </button>

      {/* Main Player Content */}
      <div className="player-content">
        {/* Album/Cover Image */}
        <div className="album-art-container">
          {song.coverUrl ? (
            <img src={song.coverUrl} alt={song.title} className="album-art" />
          ) : (
            <div className="album-art-placeholder">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
          )}
        </div>

        {/* Song Info */}
        <div className="song-info-player">
          <h1 className="song-title-player">{song.title}</h1>
          <p className="artist-name-player">{song.artist}</p>
        </div>

        {/* Playback Controls */}
        <div className="playback-controls">
          <button className="control-button" title="Previous">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>

          <button 
            className="play-pause-button" 
            onClick={handlePlayPause}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          <button className="control-button" title="Next">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>
        </div>

        {/* Additional Info */}
        <div className="additional-info">
          <div className="info-item">
            <span className="info-label">Album:</span>
            <span className="info-value">{song.album || 'Unknown Album'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Duration:</span>
            <span className="info-value">{song.duration || '0:00'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongPlayer;
