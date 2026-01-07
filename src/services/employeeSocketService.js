import { io } from 'socket.io-client';

let socket;

export const initSocket = (userId) => {
    if (!socket || !socket.connected) {
        socket = io('http://localhost:5001');

        socket.on('connect', () => {
            console.log('Connected to socket server');
            socket.emit('register', userId);
        });
    } else {
        // Ensure registered even if already connected (e.g. if passed different user? unlikely in this SP)
        // But if socket exists, just reuse it.
    }
    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
    }
};
