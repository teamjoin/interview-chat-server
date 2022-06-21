// require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const rf = require('random-facts');
const { Server } = require('socket.io')

const io = new Server(server, { cors: { origin: '*' }, path: '/' });

const users = [{ username: 'Edouard', color: '#99ccff' }, { username: 'Dimitri', color: '#99ffcc'}, { username: 'Thibaut', color: '#cc99ff'}];

const generateUser = () => {
    return users[Math.floor(Math.random() * users.length)]
}

io.on('connection', (socket) => {
    console.log('New User connected', socket.id);
    socket.on('send-message', (data) => {
        console.log('data',data);
        io.emit('new-message', data);
    });
    socket.on('forceDisconnect', function(){
        socket.disconnect(true);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
setInterval(() => {
    io.emit('new-message', { type:'text', text: rf.randomFact(), user: generateUser(), date: Date.now() } );
}, 4000)

const PORT = 3000;
const URL = `http://localhost:${PORT}/`;

server.listen(PORT, () => console.log(`Listening on ${URL}`));
