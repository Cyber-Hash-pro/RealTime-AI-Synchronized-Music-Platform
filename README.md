<div align="center">
  <h1>🎵 TunePal - AI-Powered Music Ecosystem</h1>
  <p><strong>A next-generation music platform combining AI, real-time social features, and a seamless artist experience</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/React-18%2F19-61DAFB?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js" alt="Node.js" />
    <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker" alt="Docker" />
  </p>
  <p>
    <img src="https://img.shields.io/badge/LangChain-Agents-1C3C3C?style=for-the-badge&logo=langchain" alt="LangChain" />
    <img src="https://img.shields.io/badge/Gemini-2.5_Flash-8E75B2?style=for-the-badge&logo=google-gemini" alt="Gemini" />
    <img src="https://img.shields.io/badge/Socket.io-Realtime-010101?style=for-the-badge&logo=socket.io" alt="Socket.io" />
    <img src="https://img.shields.io/badge/RabbitMQ-Events-FF6600?style=for-the-badge&logo=rabbitmq" alt="RabbitMQ" />
  </p>
</div>

---

## 📖 Overview

**TunePal** is a full-stack, microservices-based music streaming platform that leverages cutting-edge AI technologies to revolutionize how users discover and interact with music. The platform features:

- 🧠 **AI-Powered Mood Detection** using real-time facial expression analysis
- 🤖 **Conversational AI Assistant (TunePal Agent)** built with LangChain & Google Gemini
- 🎧 **Real-Time Live Sessions** for synchronized music listening with friends
- 🎨 **Dedicated Artist Dashboard** for music upload and analytics
- 📧 **Event-Driven Notifications** via RabbitMQ message queue

---

## ✨ Key Features

### 🧠 AI & Machine Learning

| Feature | Description | Technology |
|---------|-------------|------------|
| **Mood Detection** | Analyzes user facial expressions via webcam to recommend mood-matching songs | `face-api.js`, TinyFaceDetector, FaceExpressionNet |
| **Song Mood Analysis** | Automatically detects mood of uploaded songs using AI | `Google Gemini 2.5 Flash` |
| **TunePal AI Agent** | Conversational assistant that can create playlists, play songs, and recommend music | `LangChain`, `LangGraph`, `Gemini` |
| **Smart Recommendations** | AI-powered song suggestions based on mood, activity, and preferences | `Gemini Generative AI` |

### 🔊 Real-Time Features (Socket.io)

| Feature | Description |
|---------|-------------|
| **Live Sessions (Control Room)** | Create password-protected listening rooms where friends join and listen together in perfect sync |
| **Check User Online** | Real-time presence detection to see which friends are currently active |
| **Synchronized Playback** | Host controls playback (play, pause, skip) - all members stay in sync |
| **Queue Management** | Collaborative song queue that updates in real-time for all room members |

### 🎨 Artist Dashboard

| Feature | Description |
|---------|-------------|
| **Music Upload** | Upload tracks with cover art; AI automatically detects song mood |
| **Playlist Management** | Create and curate playlists for fans |
| **Artist Profile** | Customize your artist profile and bio |
| **Analytics Dashboard** | Track your music performance and listener engagement |
| **Google OAuth** | Easy login via Google authentication |

### 👤 User Platform

| Feature | Description |
|---------|-------------|
| **Home Feed** | Discover trending songs with infinite scroll pagination |
| **Liked Songs** | Personal library of favorite tracks |
| **User Playlists** | Create your own custom playlists |
| **Artist Playlists** | Explore curated playlists from artists |
| **Global Search** | Find songs by title, artist, or mood |
| **Mood-Based Browsing** | Get songs filtered by detected or selected mood |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND LAYER                                  │
├─────────────────────────────────┬───────────────────────────────────────────┤
│       👤 Users Frontend         │         🎨 Artist Frontend               │
│  React 19 + Vite + Redux        │      React 18 + Vite + Redux             │
│  face-api.js (Mood Detection)   │      Music Upload + Dashboard            │
│  Socket.io-client               │                                          │
└─────────────────┬───────────────┴───────────────────┬───────────────────────┘
                  │                                   │
                  ▼                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                     │
│                         (NGINX / Docker Network)                            │
└─────────────────────────────────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MICROSERVICES LAYER                                │
├────────────────┬─────────────────┬─────────────────┬────────────────────────┤
│   🔐 Auth      │   🎵 Music      │  🤖 TunePal    │   📧 Notification      │
│   Service      │   Service       │   Agent         │   Service              │
├────────────────┼─────────────────┼─────────────────┼────────────────────────┤
│ • JWT Auth     │ • CRUD Songs    │ • LangChain     │ • RabbitMQ Consumer   │
│ • Google OAuth │ • Playlists     │ • LangGraph     │ • Email Templates     │
│ • Bcrypt Hash  │ • Like/Unlike   │ • Gemini AI     │ • Nodemailer          │
│ • Passport.js  │ • Socket.io     │ • Tool Calling  │                        │
│                │ • ImageKit CDN  │                 │                        │
└───────┬────────┴────────┬────────┴────────┬────────┴───────────┬────────────┘
        │                 │                 │                    │
        ▼                 ▼                 ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                      │
├───────────────────────────────────┬─────────────────────────────────────────┤
│         🗄️ MongoDB Atlas           │           🐰 RabbitMQ                   │
│    (Users, Music, Playlists)      │       (Event-Driven Messaging)          │
└───────────────────────────────────┴─────────────────────────────────────────┘
```

---

## 📂 Project Structure

```bash
tunepal/
├── Artist/                    # 🎨 Artist Dashboard (React + Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Dashboard, Upload, Playlists, Profile
│   │   ├── store/             # Redux slices & actions
│   │   └── config/            # API configuration
│   └── Dockerfile             # Multi-stage build with Nginx
│
├── Users/                     # 👤 User Platform (React + Vite)
│   ├── public/models/         # face-api.js AI models
│   ├── src/
│   │   ├── components/        # MusicPlayer, Sidebar, Cards, ControlRoom
│   │   ├── pages/             # Home, MoodDetector, TunePal, ControlRoom
│   │   ├── services/          # Socket services
│   │   ├── contexts/          # Music context provider
│   │   └── Store/             # Redux state management
│   └── Dockerfile             # Multi-stage build with Nginx
│
├── auth/                      # 🔐 Authentication Service
│   ├── src/
│   │   ├── controllers/       # Register, Login, Google OAuth
│   │   ├── middleware/        # JWT validation, input validation
│   │   ├── model/             # User schema (Mongoose)
│   │   ├── routes/            # Auth API routes
│   │   └── broker/            # RabbitMQ publisher
│   └── Dockerfile
│
├── music/                     # 🎵 Music Service (Core API)
│   ├── src/
│   │   ├── controllers/       # Music CRUD, Playlists, Likes, Search
│   │   ├── middlewares/       # Auth middleware, Mood detection
│   │   ├── model/             # Music, Playlist, LikeSong, UserPlaylist
│   │   ├── routes/            # REST API + Agent routes
│   │   ├── services/          # Gemini AI, ImageKit storage
│   │   └── sockets/           # Live Session Socket.io server
│   └── Dockerfile
│
├── TunePal/                   # �� AI Agent Service
│   ├── src/
│   │   ├── agent/
│   │   │   ├── agent.js       # LangGraph state machine
│   │   │   └── tools/         # CreatePlaylist, PlaySong, Recommend, SongDetails
│   │   ├── model/             # Chat history schema
│   │   └── sockets/           # TunePal WebSocket server
│   └── Dockerfile
│
├── notification/              # 📧 Notification Service
│   ├── src/
│   │   ├── broker/            # RabbitMQ subscriber
│   │   └── utils/             # Email templates (Nodemailer)
│   └── Dockerfile
│
└── docker-compose.yml         # 🐳 Full orchestration config
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18/19 | UI Library |
| Vite | Build Tool & Dev Server |
| Redux Toolkit | Global State Management |
| Tailwind CSS | Utility-First Styling |
| Framer Motion | Animations |
| face-api.js | Facial Expression Detection |
| Socket.io-client | Real-time Communication |
| Axios | HTTP Client |
| React Hook Form | Form Management |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js 20 | Runtime Environment |
| Express 5 | Web Framework |
| MongoDB + Mongoose | Database & ODM |
| Socket.io | WebSocket Server |
| JWT | Authentication Tokens |
| Passport.js | OAuth Strategies |
| Multer | File Upload Handling |
| ImageKit | Media CDN & Storage |

### AI & ML
| Technology | Purpose |
|------------|---------|
| LangChain | AI Agent Framework |
| LangGraph | State Machine for Agents |
| Google Gemini 2.5 Flash | LLM for Chat & Analysis |
| face-api.js | Browser-Based Face Detection |
| TinyFaceDetector | Lightweight Face Detection Model |
| FaceExpressionNet | Emotion Recognition Model |

### DevOps & Infrastructure
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Multi-Container Orchestration |
| Nginx | Static File Serving (Frontend) |
| RabbitMQ | Message Queue (Events) |

---

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API Key
- ImageKit Account (for media storage)

### Environment Variables

Create `.env` files in each service directory:

**auth/.env**
```env
PORT=3000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_super_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
RABBITMQ_URL=amqp://localhost:5672
```

**music/.env**
```env
PORT=3001
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_super_secret_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public
IMAGEKIT_PRIVATE_KEY=your_imagekit_private
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
GEMINI_API_KEY=your_gemini_api_key
```

**TunePal/.env**
```env
PORT=3005
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

### Running with Docker

```bash
# Clone the repository
git clone https://github.com/your-username/tunepal.git
cd tunepal

# Start all services
docker-compose up --build

# Access the applications
# User Platform:   http://localhost:5174
# Artist Dashboard: http://localhost:5173
# RabbitMQ Manager: http://localhost:15672
```

### Running Locally (Development)

```bash
# Terminal 1 - Auth Service
cd auth && npm install && node server.js

# Terminal 2 - Music Service
cd music && npm install && node server.js

# Terminal 3 - TunePal Agent
cd TunePal && npm install && node server.js

# Terminal 4 - Notification Service
cd notification && npm install && node server.js

# Terminal 5 - User Frontend
cd Users && npm install && npm run dev

# Terminal 6 - Artist Frontend
cd Artist && npm install && npm run dev
```

---

## 📡 API Endpoints

### Auth Service (`:3000`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/google` | Google OAuth initiation |
| GET | `/api/auth/google/callback` | Google OAuth callback |
| GET | `/api/auth/user/me` | Get current user |
| GET | `/api/auth/logout` | Logout user |

### Music Service (`:3001`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/music/` | Get all songs (paginated) |
| GET | `/api/music/get-details/:id` | Get song by ID |
| POST | `/api/music/upload` | Upload new song (Artist) |
| GET | `/api/music/artist-music` | Get artist's songs |
| GET | `/api/music/allPlaylist` | Get all public playlists |
| POST | `/api/music/playlist` | Create playlist (Artist) |
| GET | `/api/music/playlist/:id` | Get playlist by ID |
| POST | `/api/music/createUserPlaylist` | Create user playlist |
| GET | `/api/music/userPlaylists` | Get user's playlists |
| POST | `/api/music/likeSong/:id` | Like/unlike a song |
| GET | `/api/music/all/likedSongs` | Get liked songs |
| GET | `/api/music/mood-dectect` | Get songs by mood |
| GET | `/api/music/search/:query` | Search songs |

### TunePal Agent Tools
| Tool | Description |
|------|-------------|
| `CreatePlaylist` | Creates a new playlist with specified songs |
| `PlayPlaylistSong` | Plays songs from a playlist |
| `SongDetails` | Fetches detailed information about a song |
| `RecommendSong` | Recommends songs based on mood/activity |

---

## 🔌 Socket Events

### Music Service (Live Sessions)
| Event | Direction | Description |
|-------|-----------|-------------|
| `createroom` | Client → Server | Create a new listening room |
| `joinroom` | Client → Server | Join existing room with code |
| `play` | Bidirectional | Sync play action across room |
| `check-user-online` | Client → Server | Check if user is online |
| `user-status` | Server → Client | Online status response |

### TunePal Service (AI Chat)
| Event | Direction | Description |
|-------|-----------|-------------|
| `user-message` | Client → Server | Send message to AI |
| `ai-response` | Server → Client | Receive AI response |

---

## 🧪 TunePal AI Agent - How It Works

```javascript
// LangGraph State Machine Flow
START → CHAT (Gemini) → [Function Call?] → TOOLS → CHAT → END

// Available Tools
1. CreatePlaylist  → Creates playlist via Music API
2. PlayPlaylistSong → Streams playlist songs
3. SongDetails     → Fetches song metadata
4. RecommendSong   → AI recommendations by mood
```

**Example Conversation:**
```
User: "I'm feeling sad, can you recommend some songs?"
Agent: [Calls RecommendSong tool with mood="sad"]
       → Returns: "Here are some comforting songs for you: ..."

User: "Create a playlist called 'Rainy Day' with those songs"
Agent: [Calls CreatePlaylist tool]
       → Returns: "I've created your 'Rainy Day' playlist! 🎵"
```

---

## 🎯 Future Roadmap

- [ ] Progressive Web App (PWA) support
- [ ] Offline mode with cached songs
- [ ] Lyrics display with karaoke mode
- [ ] Artist verification system
- [ ] Social features (follow artists, share playlists)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Podcast support

---

## 👨‍💻 Author

**[Your Name]**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/your-username)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/your-profile)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=google-chrome&logoColor=white)](https://your-portfolio.com)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Built with ❤️ using React, Node.js, LangChain & Gemini AI</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
