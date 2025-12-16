import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_MUSIC_API_URL || 'http://localhost:3001';

const socketInstance = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: false, // Don't connect automatically
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
});

// Function to connect socket (call this after user is authenticated)
export const connectSocket = () => {
    if (!socketInstance.connected) {
        socketInstance.connect();
    }
};

// Function to disconnect socket
export const disconnectSocket = () => {
    if (socketInstance.connected) {
        socketInstance.disconnect();
    }
};

// Handle connection errors silently
socketInstance.on('connect_error', (error) => {
    console.log('Socket connection error:', error.message);
    // Don't show error to user, just log it
});

socketInstance.on('connect', () => {
    console.log('Socket connected successfully');
});

export default socketInstance;