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
    if(players%2==1){
        console.log(''+Math.floor(players/2)+'start');
        socket.emit(''+Math.floor(players/2)+'start',1)
    }
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