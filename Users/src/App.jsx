import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { MusicProvider } from './contexts/MusicContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import SongDetails from './pages/SongDetails';
import LikedSongs from './pages/LikedSongs';
import ArtistPlaylists from './pages/ArtistPlaylists';
import SinglePlaylist from './pages/SinglePlaylist';
import CreatePlaylist from './pages/CreatePlaylist';
import MyPlaylists from './pages/MyPlaylists';
import JoinFriends from './pages/JoinFriends';
import ControlRoom from './pages/ControlRoom';
import MoodDetector from './pages/MoodDetector';
import MoodSongs from './pages/MoodSongs';
import Search from './pages/Search';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserPlaylist from './pages/userPlaylist';
import { checkAuthStatus } from './Store/actions/userAction';

const App = () => {
  const dispatch = useDispatch();

  // Check auth status on app load
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <MusicProvider>
      <Router>
        <Routes>
          {/* Auth Routes - Without MainLayout */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected App Routes - With MainLayout */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Home />} />
            <Route path="song/:id" element={<SongDetails />} />
            <Route path="liked-songs" element={<LikedSongs />} />
            <Route path="artist-playlists" element={<ArtistPlaylists />} />
            <Route path="playlist/:id" element={<SinglePlaylist />} />
            <Route path='user-playlist/:id' element={<UserPlaylist/>} />
            <Route path="create-playlist" element={<CreatePlaylist />} />
            <Route path="my-playlists" element={<MyPlaylists />} />
            <Route path="join-friends" element={<JoinFriends />} />
            <Route path="control-room/:code" element={<ControlRoom />} />
            <Route path="mood-detector" element={<MoodDetector />} />
            <Route path="mood-songs/:mood" element={<MoodSongs />} />
            <Route path="search" element={<Search />} />
          </Route>
        </Routes>
      </Router>
    </MusicProvider>
  );
};

export default App;