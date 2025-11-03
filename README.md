# MusicStream - Spotify-like Music Application

A modern, full-stack music streaming application built with React, Node.js, Express, and MongoDB. Features include user authentication, music upload for artists, real-time playback synchronization with Socket.io, and email notifications via RabbitMQ.

## 🎵 Features

- **User Authentication**: Register/Login with email or Google OAuth
- **Role-based Access**: Different features for users and artists
- **Music Upload**: Artists can upload songs with cover images
- **Real-time Playback**: Socket.io integration for synchronized playback
- **Search & Discovery**: Advanced search functionality
- **Responsive Design**: Mobile-first Spotify-like UI
- **Email Notifications**: Welcome emails via RabbitMQ and Nodemailer
- **Cloud Storage**: ImageKit integration for file storage

## 🏗️ Architecture

### Microservices Structure
- **Frontend** (React + Vite + Tailwind CSS) - Port 5174
- **Auth Service** (Express + JWT + Passport) - Port 3000
- **Music Service** (Express + Socket.io) - Port 3003
- **Notification Service** (RabbitMQ + Nodemailer) - Port 3001

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- RabbitMQ
- ImageKit account (for file storage)
- Google OAuth credentials
- Gmail account for email notifications

### Environment Variables

Create `.env` files in each service directory:

#### Auth Service (.env)
```env
MONGODB_URI=mongodb://localhost:27017/musicstream-auth
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
RABBITMQ_URL=amqp://localhost
```

#### Music Service (.env)
```env
MONGODB_URI=mongodb://localhost:27017/musicstream-music
JWT_SECRET=your_jwt_secret_here
Imagekit_PUBLIC_KEY=your_imagekit_public_key
Imagekit_PRIVATE_KEY=your_imagekit_private_key
Imagekit_URL_ENDPOINT=your_imagekit_url_endpoint
```

#### Notification Service (.env)
```env
RABBITMQ_URL=amqp://localhost
EMAIL_USER=your_gmail_email
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN_SECRET=your_google_oauth_refresh_token
```

### Installation & Setup

1. **Clone the repository and install dependencies:**
```bash
# Install frontend dependencies
cd frontend
npm install

# Install auth service dependencies
cd ../auth
npm install

# Install music service dependencies
cd ../music
npm install

# Install notification service dependencies
cd ../notification
npm install
```

2. **Start MongoDB and RabbitMQ:**
```bash
# Start MongoDB (varies by OS)
sudo systemctl start mongod

# Start RabbitMQ (varies by OS)
sudo systemctl start rabbitmq-server
```

3. **Start all services:**

Open 4 terminal windows and run:

```bash
# Terminal 1 - Auth Service
cd auth
npm run dev

# Terminal 2 - Music Service  
cd music
node server.js

# Terminal 3 - Notification Service
cd notification
npm run dev

# Terminal 4 - Frontend
cd frontend
npm run dev
```

4. **Access the application:**
   - Frontend: http://localhost:5174
   - Auth API: http://localhost:3000
   - Music API: http://localhost:3003
   - Notification Service: http://localhost:3001

## 🎯 Usage

### For Users
1. Register or login with email/Google
2. Browse music on the home page
3. Search for songs and artists
4. Create and manage playlists
5. Like songs and build your library

### For Artists
1. Register with an artist role
2. Upload music with cover images
3. Manage your uploaded songs
4. Create playlists of your work
5. View your artist dashboard

## 🛠️ API Endpoints

### Auth Service (Port 3000)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

### Music Service (Port 3003)
- `GET /api/music` - Get all music (paginated)
- `GET /api/music/get-details/:id` - Get music by ID
- `POST /api/music/upload` - Upload music (artists only)
- `GET /api/music/artist-music` - Get artist's music
- `POST /api/music/playlist` - Create playlist
- `GET /api/music/playlist` - Get user playlists
- `GET /api/music/playlist/:id` - Get playlist by ID

## 🔧 Tech Stack

### Frontend
- React 19 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Socket.io-client for real-time features
- React Icons & Lucide React for icons

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- Socket.io for real-time communication
- JWT for authentication
- Passport.js for Google OAuth
- Multer for file uploads
- ImageKit for cloud storage
- RabbitMQ for message queuing
- Nodemailer for email notifications

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

Key responsive features:
- Collapsible sidebar on mobile
- Touch-friendly controls
- Optimized layouts for different screen sizes
- Mobile-first design approach

## 🎨 UI/UX Features

- **Spotify-inspired Design**: Dark theme with green accents
- **Smooth Animations**: Hover effects and transitions
- **Interactive Player**: Real-time progress bar and controls
- **Grid/List Views**: Multiple ways to browse music
- **Search Suggestions**: Recent searches and genre browsing
- **Loading States**: Skeleton loaders and progress indicators

## 🔐 Security Features

- JWT token authentication
- Protected routes and API endpoints
- Role-based access control
- Input validation and sanitization
- Secure file upload handling
- CORS configuration

## 📧 Email Integration

- Welcome email notifications for new users
- Queue-based email processing with RabbitMQ
- OAuth2 integration with Gmail
- HTML email templates

## 🚀 Deployment Notes

For production deployment:
1. Use environment variables for all sensitive data
2. Set up MongoDB Atlas for cloud database
3. Configure CloudAMQP for RabbitMQ hosting
4. Use proper process managers (PM2)
5. Set up reverse proxy (Nginx)
6. Enable HTTPS/SSL certificates
7. Configure CORS for production domains

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Spotify for UI/UX inspiration
- The React community for excellent documentation
- All contributors and open-source libraries used

---

**Note**: This is a demonstration project. For production use, additional security measures, error handling, and performance optimizations should be implemented.