import React, { useEffect, useState } from 'react';
import './CreatePlaylist.css';
import { useDispatch, useSelector } from 'react-redux';
import {createMyPlaylist} from '../store/actions/musicAction.jsx'

const CreatePlaylist = () => {
  const [playlistTitle, setPlaylistTitle] = useState('');
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [songs, setSongs] = useState([]); 
  const dispatch = useDispatch()
  // Sample songs data - Replace with actual API data
  const  music = useSelector((state) => state.music.musicdata);
  useEffect(() => {
setSongs(music);

   }, [music]);


  const handleSongToggle = (songId) => {
    const song = songs.find(s => s._id === songId);
    
    if (selectedSongs.includes(songId)) {
      setSelectedSongs(selectedSongs.filter(id => id !== songId));
      console.log('Removed song:', { id: songId, title: song?.title });
    } else {
      setSelectedSongs([...selectedSongs, songId]);
      console.log('Added song:', { id: songId, title: song?.title });
    }
  };

  const handleCreatePlaylist = async() => {
    if (!playlistTitle.trim()) {
      alert('Please enter a playlist title');
      return;
    }
    if (selectedSongs.length === 0) {
      alert('Please select at least one song');
      return;
    }
    
    
    const selectedSongDetails = selectedSongs.map(songId => {
      const song = songs.find(s => s._id === songId);
      return {
        id: song?._id,
        title: song?.title
      };
    });
    
    const playlistData = {
      title: playlistTitle,
      musics: selectedSongs,
      songDetails: selectedSongDetails
    };
    
    console.log('Creating playlist:', playlistData);
 dispatch(createMyPlaylist(playlistData));
   
    
    // Add your API call here
  };

  return (
    <div className="create-playlist-container">
      <div className="create-playlist-content">
        {/* Header Section */}
        <div className="playlist-header">
          <button className="back-button">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <h1 className="page-title">Create Playlist</h1>
        </div>

        {/* Playlist Title Input */}
        <div className="playlist-title-section">
          <div className="title-input-wrapper">
            <label htmlFor="playlist-title">Playlist Title</label>
            <input
              type="text"
              id="playlist-title"
              placeholder="Enter playlist name..."
              value={playlistTitle}
              onChange={(e) => setPlaylistTitle(e.target.value)}
              className="playlist-title-input"
            />
          </div>
          <div className="selected-count">
            {selectedSongs.length} {selectedSongs.length === 1 ? 'song' : 'songs'} selected
          </div>
        </div>

        {/* Songs List */}
        <div className="songs-section">
          <h2 className="section-title">Select Songs</h2>
          <div className="songs-list">
            {songs.map((song,index) => (
              <div 
                key={index} 
                className={`song-item ${selectedSongs.includes(song.id) ? 'selected' : ''}`}
              >
                <div className="song-left">
                  <div className="song-image">
                    {song.image ? (
                      <img src={song.image} alt={song.title} />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                      </svg>
                    )}
                  </div>
                  <div className="song-info">
                    <h3 className="song-name">{song.title}</h3>
                    <p className="song-artist">{song.artist}</p>
                  </div>
                </div>

                <div className="song-right">
                  <span className="song-duration">{song.duration}</span>
                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={selectedSongs.includes(song._id)}
                      onChange={() => handleSongToggle(song._id)}
                    />
                    <span className="checkmark"></span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create Button */}
        <div className="create-button-section">
          <button 
            className="create-playlist-button"
            onClick={handleCreatePlaylist}
            disabled={!playlistTitle.trim() || selectedSongs.length === 0}
          >
            Create Playlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylist;