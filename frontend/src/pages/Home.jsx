import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import WelcomeSection from '../components/WelcomeSection';
import ContentSection from '../components/ContentSection';
import MyPlaylistSection from '../components/MyPlaylistSection';
import ArtistPlaylistSection from '../components/ArtistPlaylistSection';
import SongListSection from '../components/SongListSection';
import './Home.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMusicData ,fetchMusicPlaylist, fetchMyPlaylists} from '../store/actions/musicAction';

const Home = () => {
  const navigate = useNavigate();
  const [currentSong, setCurrentSong] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [songs, setSongs] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMoodDetectorOpen, setIsMoodDetectorOpen] = useState(false);
  const { musicdata, musicPlaylist, myPlaylist  } = useSelector(state => state.music);
  const dispatch = useDispatch();

  // Debug logging
  console.log('Redux State - musicdata:', musicdata);
  console.log('Redux State - musicPlaylist (Artist Playlists):', musicPlaylist);
  console.log('Redux State - myPlaylist (User Playlists):', myPlaylist);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleMoodDetector = () => {
    setIsMoodDetectorOpen(!isMoodDetectorOpen);
  };

  const closeMoodDetector = () => {
    setIsMoodDetectorOpen(false);
  };

  const handlePlay = (songInfo) => {
    console.log('Playing song:', songInfo);
    
    // Navigate to song player page
    if (songInfo._id) {
      navigate(`/song/${songInfo._id}`);
    }
  };

  const handlePlaylistClick = (playlist) => {
    console.log('Opening playlist:', playlist);
    // You can navigate to a playlist page here
    // navigate(`/playlist/${playlist._id}`);
  };

  const handleArtistClick = (artist) => {
    console.log('Opening artist:', artist);
    // You can navigate to an artist page here
    // navigate(`/artist/${artist._id}`);
  };

  useEffect(() => {
  dispatch(fetchMusicData());
  dispatch(fetchMusicPlaylist()); // Fetch artist playlists
  dispatch(fetchMyPlaylists()); // Fetch user playlists
}, [dispatch]);

useEffect(() => {
  if (musicPlaylist && musicPlaylist.length > 0) {
    setPlaylist(musicPlaylist);
  }
  if (musicdata && musicdata.length > 0) {
    setSongs(musicdata);
  }
  
}, [musicdata, musicPlaylist]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="home-container">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        currentSong={currentSong}
        onNavigate={closeSidebar}
      />

      {/* Main Content */}
      <main className={`main-content ${isMoodDetectorOpen ? 'blurred' : ''}`}>
        {/* Header with Profile */}
        <Header onMenuClick={toggleSidebar} />

        {/* Content Area */}
        <div className="content-area">
          <WelcomeSection 
            greeting={getGreeting()} 
            quickPicks={musicPlaylist}
          />

          <ContentSection 
            title="My Playlists"
            onSeeAll={() => console.log('See all playlists')}
          >
            <MyPlaylistSection 
              playlists={Array.isArray(myPlaylist) ? myPlaylist : []}
              onPlaylistClick={handlePlaylistClick}
            />
          </ContentSection>

          <ContentSection 
            title="Artist Playlists"
            onSeeAll={() => console.log('See all artists')}
          >
            <ArtistPlaylistSection 
              artists={Array.isArray(playlist) ? playlist : []}
              onArtistClick={handleArtistClick}
            />
          </ContentSection>
         
          <ContentSection 
            title="Made for you"
            onSeeAll={() => console.log('See all Made for you')}
          >
            <SongListSection 
              songs={songs}
              onSongClick={handlePlay}
              currentSong={currentSong}
              isPlaying={false}
            />
          </ContentSection>

         
        </div>
      </main>

      {/* Floating Plus Button */}
      <button 
        className="floating-plus-button" 
        onClick={toggleMoodDetector}
        title="Mood Detector"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
      </button>

      {/* Mood Detector Modal */}
      {isMoodDetectorOpen && (
        <div className="mood-detector-modal">
          <div className="modal-overlay" onClick={closeMoodDetector}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Mood Detector</h2>
              <button className="close-modal-button" onClick={closeMoodDetector}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <iframe 
                src="http://localhost:5174" 
                title="Mood Detector"
                className="mood-detector-iframe"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 