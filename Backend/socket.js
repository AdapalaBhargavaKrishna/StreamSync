let roomUsers = {};
let roomVideos = {};

export const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log('client connected:', socket.id);

        socket.on('joinRoom', ({ roomId, user }) => {
            socket.join(roomId);
            socket.data.username = user;
            console.log(`User ${socket.id} joined room ${roomId}`);

            if (!roomUsers[roomId]) roomUsers[roomId] = [];
            const exists = roomUsers[roomId].some(u => u.name === user);
            if (!exists) {
                const isHost = roomUsers[roomId].length === 0;
                roomUsers[roomId].push({ name: user, isHost });
            }

            io.to(roomId).emit('roomData', { users: roomUsers[roomId] });

            if (roomVideos[roomId]) {
                socket.emit('setVideo', roomVideos[roomId]);
            }
        });

        socket.on('chatMessage', ({ roomId, message }) => {
            io.to(roomId).emit('chatMessage', message);
        });

        socket.on('videoControl', ({ roomId, type, time }) => {
            io.to(roomId).emit('videoControl', { type, time });
        });

        socket.on('setVideo', ({ roomId, videoUrl }) => {
            roomVideos[roomId] = videoUrl;
            io.to(roomId).emit('setVideo', videoUrl);
        });

        socket.on('leaveroom', ({ roomId, user }) => {
            socket.leave(roomId);
            console.log(`🚪 ${user} left room ${roomId}`);
            if (roomUsers[roomId]) {
                roomUsers[roomId] = roomUsers[roomId].filter(u => u.name !== user);
                io.to(roomId).emit('roomData', { users: roomUsers[roomId] });
            }
        });

        socket.on('kickUser', ({ roomId, target }) => {
            const socketsInRoom = io.sockets.adapter.rooms.get(roomId);
            if (!socketsInRoom) return;

            // Find the target's socket
            for (const clientId of socketsInRoom) {
                const clientSocket = io.sockets.sockets.get(clientId);
                if (clientSocket && clientSocket.data?.username === target) {
                    clientSocket.emit('kicked');
                    clientSocket.leave(roomId);
                    break;
                }
            }

            // Remove user from memory if you're tracking in-memory
            if (roomUsers[roomId]) {
                roomUsers[roomId] = roomUsers[roomId].filter(u => u.name !== target);
                io.to(roomId).emit('roomData', { users: roomUsers[roomId] });
            }
        });


        socket.on('disconnect', () => {
            console.log('❌ Client disconnected:', socket.id);
        });
    });
};