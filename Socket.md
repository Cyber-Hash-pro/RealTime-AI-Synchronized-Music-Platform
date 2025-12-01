import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  // Connect to socket server
  connect() {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    this.socket = io('http://localhost:3001', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      this.isConnected = false;
    });

    return this.socket;
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Emit play event to broadcast music to all connected devices
  emitPlay(musicId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('play', { musicId });
      console.log('Emitted play event for music:', musicId);
    }
  }

  // Listen for play events from other devices
  onPlay(callback) {
    if (this.socket) {
      this.socket.on('play', (data) => {
        console.log('Received play event:', data);
        callback(data);
      });
    }
  }

  // Remove play listener
  offPlay() {
    if (this.socket) {
      this.socket.off('play');
    }
  }

  // Check if a user is online
  checkUserOnline(email) {
    if (this.socket && this.isConnected) {
      this.socket.emit('check-user-online', email);
    }
  }

  // Listen for user status response
  onUserStatus(callback) {
    if (this.socket) {
      this.socket.on('user-status', (data) => {
        console.log('User status:', data);
        callback(data);
      });
    }
  }

  // Listen for user offline events
  onUserOffline(callback) {
    if (this.socket) {
      this.socket.on('user-offline', (data) => {
        console.log('User went offline:', data);
        callback(data);
      });
    }
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }

  // Check connection status
  isSocketConnected() {
    return this.isConnected;
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
