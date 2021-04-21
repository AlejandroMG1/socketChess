const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origins: ['*']
    }
});
app.get('/', (req, res) => {
    res.send('<h1>Hey Socket.io</h1>');
});

players = -1;
io.on('connection', (socket) => {
    console.log('a user connected');
    players++;
    socket.emit('getPlayer',{color:players%2,room:Math.floor(players/2)})
    socket.on('start', (room) => {
        io.emit(''+room+'start', room);
    });
    socket.on('disconnect', () => {
        players--;
        console.log('user disconnected');
    });
    socket.on('move', (move) => {
        io.emit(''+move.room+move.color+'move', move);
    });
});
http.listen(3000,'0.0.0.0', () => {
    console.log('listening on *:3000');
});