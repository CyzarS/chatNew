import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', (username) => {
    socket.data.username = username;
    console.log(`${username} Se unio al chat`);
    io.emit('user-joined', `${username}: Se unio al chat`);
  });

  socket.on('message', (message) => {
    const username = socket.data.username;
    io.emit('message', { username, message });
  });

  socket.on('disconnect', () => {
    const username = socket.data.username;
    if (username) {
      console.log(`${username} Se fue we, ando bien triste`);
      io.emit('user-left', `${username}: Se fue we, ando bien triste`);
    }
    console.log('Se fue un usuario');
  });
});

server.listen(PORT, () => {
  console.log(`listening on :${PORT}`);
});