import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MusicProvider } from './contexts/MusicContext';
import MainLayout from './layouts/MainLayout';
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
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authenticateUser } from './Store/actions/userAction.jsx';
import { AUTH_API } from './config/api';                   
import TunePal from './pages/TunePal.jsx';


// ✔ ProtectedRoute Component Inside Same File
const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`${AUTH_API}/user/me`, {
      withCredentials: true
    })
      .then(() => setIsAuth(true))
      .catch(() => setIsAuth(false));



        dispatch(authenticateUser())
        
  }, [dispatch]);

  if (isAuth === null) {
    return <p>Checking Authentication...</p>;
  }

  return isAuth ? children : <Navigate to="/login" replace />;
};


const App = () => {
  return (
    <MusicProvider>
      <Router>
        <Routes>

          {/* Public Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />


          {/* Protected Pages (No LocalStorage Use) */}
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
            <Route path='user-playlist/:id' element={<UserPlaylist />} />
            <Route path="create-playlist" element={<CreatePlaylist />} />
            <Route path="my-playlists" element={<MyPlaylists />} />
            <Route path="join-friends" element={<JoinFriends />} />
            <Route path="control-room/:code" element={<ControlRoom />} />
            <Route path="mood-detector" element={<MoodDetector />} />
            <Route path="mood-songs/:mood" element={<MoodSongs />} />
            <Route path="search" element={<Search />} />
            <Route path='tunepal' element={<TunePal/>} />
          </Route>

        </Routes>
      </Router>
    </MusicProvider>
  );
};

export default App;
