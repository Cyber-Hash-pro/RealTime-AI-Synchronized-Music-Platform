import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';

const TUNEPAL_URL = import.meta.env.VITE_TUNEPAL_URL || 'http://localhost:3003';

let tunePalSocket = null;

export const useTunePalSocket = () => {
  const [socket, setSocket] = useState(null);

  const connect = () => {
    if (!tunePalSocket) {
      tunePalSocket = io(TUNEPAL_URL, {
        withCredentials: true,
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      tunePalSocket.on('connect', () => {
        console.log('TunePal Socket Connected:', tunePalSocket.id);
      });

      tunePalSocket.on('connect_error', (error) => {
        console.error('TunePal Socket Connection Error:', error.message);
      });

      tunePalSocket.on('disconnect', (reason) => {
        console.log('TunePal Socket Disconnected:', reason);
      });

      setSocket(tunePalSocket);
    } else {
      setSocket(tunePalSocket);
    }
  };

  const disconnect = () => {
    if (tunePalSocket) {
      tunePalSocket.disconnect();
      tunePalSocket = null;
      setSocket(null);
    }
  };

  const sendMessage = (message) => {
    if (tunePalSocket && tunePalSocket.connected) {
      tunePalSocket.emit('ai-message', { message });
    } else {
      console.error('TunePal Socket not connected');
    }
  };

  return {
    socket,
    connect,
    disconnect,
    sendMessage,
  };
};

export default tunePalSocket;
