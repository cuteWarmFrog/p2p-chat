const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const { ExpressPeerServer } = require('peer');

const app = express();

const server = http.createServer(app);
const io = socketio(server).sockets;

app.use(express.json());

const idGenerator = () => {
    return (Math.random().toString(36) + "0000000000000000000").substr(2, 16);
}

const peerServer = ExpressPeerServer(server, {
    debug: true,
    path: '/',
    generateClientId: idGenerator
})

app.use('/mypeer', peerServer);

io.on('connection', (socket) => {
    console.log('logi ebat cabana');
    socket.on('join-room', ({ roomId, userId }) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);
    })
})

const port = 6000;

server.listen(port, () => console.log(`Server is running on ${port} port}`));
