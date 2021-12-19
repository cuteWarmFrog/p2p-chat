const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require("socket.io");
const app = express();
const uuidGen = require('uuid');
const { ExpressPeerServer } = require('peer');
const {log} = require("nodemon/lib/utils");
const {sendMessage} = require("./firebase");

const localDB = new Map();

const serverPort = 5000

app.use(cors());

const server = http.createServer(app);

const socketServer = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

class LocalClient {
    constructor(token, roomId) {
        this._token = token;
        this._roomId = roomId;
    }

    setRoomId(value) {
        this._roomId = value;
    }
}

const peerServer = ExpressPeerServer(server, {
    debug: true,
    path: '/',
    generateClientId: uuidGen.v4()
})

app.use('/mypeer',peerServer)

app.use('/login', (req, res) =>  {
    if (req.query.userLogin && req.query.token) {
        if (localDB.has(req.query.userLogin)) {
            res.send('Login is taken!')
        } else {
            const lc = new LocalClient(req.query.token, null);
            localDB.set(req.query.userLogin, lc);
            res.send('Success login in Base!')
        }
    }
    res.send('Error input data')
})

app.use('/call', (req, res) => {
    const { partnerLogin, login } = req.query;
    const { roomId } = localDB.get(login);
    const { partnerToken } = localDB.get(partnerLogin);
    if(partnerToken && roomId && login) {
        sendMessage(partnerToken, login, roomId);
        res.send('Push sent');
    } else {
        res.send('Error!')
    }
})

socketServer.on('connection', (socket) => {

    console.log('Eboklak')

    socket.on('join-room', ({userId, roomId, login }) => {
        console.log(`${login} joined room: ${roomId}`);

        socket.join(roomId);
        localDB.set(login, {...localDB.get(login), roomId });

        socket.to(roomId).broadcast.emit('user-connected', userId);
    })


});

server.listen(serverPort, () => {
    console.log(`Server start on local port ${serverPort} and global port ${serverPort + 8060}`);
});
