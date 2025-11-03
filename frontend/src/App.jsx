import { Routes, Route, Link, NavLink } from 'react-router-dom'
import './App.css'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import ArtistDashboard from './pages/artist/ArtistDashboard'
import UploadMusic from './pages/artist/UploadMusic'
import MusicPlayer from './pages/music/MusicPlayer'
import { io } from 'socket.io-client'

function App() {

  const [ socket, setSocket ] = useState(null)

  useEffect(() => {

    const newSocket = io("localhost:3002", {
      withCredentials: true,
    })

    setSocket(newSocket)

    newSocket.on("play", (data) => {
      const musicId = data.musicId
      window.location.href = `/music/${musicId}`
    })

  }, [])


  return (
    <div className="app">
      {/* Sidebar Navigation */}
      <aside className="app-sidebar">
        <div className="spotify-logo">
          Music App
        </div>
        
        <nav>
          <ul className="nav-menu">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? 'nav-home active' : 'nav-home'}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/search" 
                className={({ isActive }) => isActive ? 'nav-search active' : 'nav-search'}
              >
                Search
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/library" 
                className={({ isActive }) => isActive ? 'nav-library active' : 'nav-library'}
              >
                Your Library
              </NavLink>
            </li>
          </ul>
          
          <div style={{ marginTop: 'var(--space-8)', marginBottom: 'var(--space-4)' }}>
            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: 'var(--space-4) 0' }} />
          </div>
          
          <ul className="nav-menu">
            <li>
              <NavLink 
                to="/artist/dashboard" 
                className={({ isActive }) => isActive ? 'nav-artist active' : 'nav-artist'}
              >
                Artist Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/artist/dashboard/upload-music" 
                className={({ isActive }) => isActive ? 'nav-upload active' : 'nav-upload'}
              >
                Upload Music
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/register" 
                className={({ isActive }) => isActive ? 'nav-register active' : 'nav-register'}
              >
                Register
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/login" 
                className={({ isActive }) => isActive ? 'nav-login active' : 'nav-login'}
              >
                Login
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home socket={socket} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/artist/dashboard" element={<ArtistDashboard />} />
          <Route path="/artist/dashboard/upload-music" element={<UploadMusic />} />
          <Route path="/music/:id" element={<MusicPlayer />} />
        </Routes>
      </main>

      {/* Bottom Play Bar */}
      <div className="app-playbar">
        <div className="playbar-left">
          <div className="current-track-info">
            <div className="track-image">
              {/* Track image placeholder */}
            </div>
            <div className="track-details">
              <div className="track-name">Track Name</div>
              <div className="track-artist">Artist Name</div>
            </div>
          </div>
        </div>
        
        <div className="playbar-center">
          <div className="player-controls">
            {/* Player controls will go here */}
            <button className="btn-small btn-secondary">⏮</button>
            <button className="btn-small">⏯</button>
            <button className="btn-small btn-secondary">⏭</button>
          </div>
        </div>
        
        <div className="playbar-right">
          <div className="volume-controls">
            {/* Volume controls will go here */}
            <button className="btn-small btn-secondary">🔊</button>
          </div>
        </div>
      </div>
    </div>

  )
}

export default App
