// require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
var rf = require('random-facts');

const io = require('socket.io')(server, { cors: { origin: '*' } });

const users = [{ username: 'Edouard', color: 'blue' }, { username: 'Dimitri', color: 'red'}, { username: 'Thibaut', color: 'pink'}];

const generateUser = () => {
    return users[Math.floor(Math.random() * users.length)]
}
// events will go here...
io.on('connection', (socket) => {
    console.log('New User connected', socket.id);

    socket.on('send-message', (data) => {
        // console.log(`Message from client: ${data.text}, whoose id is: ${data.from}`);
        console.log('data',data);
        io.emit('new-message', data);
    });


    socket.on('forceDisconnect', function(){
        socket.disconnect(true);
    })

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
setInterval(() => {
    io.emit('new-message', { text: rf.randomFact(), user: generateUser(), date: Date.now() } );
}, 4000)

const PORT = 3030; // process.env.PORT || 80;
const URL = `http://localhost:${PORT}/`;

server.listen(PORT, () => console.log(`Listening on ${URL}`));
