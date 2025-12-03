import {io } from 'socket.io-client';

const socketInstance = io('http://localhost:3001', {
    withCredentials: true,
});

export default socketInstance;