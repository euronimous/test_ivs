/**
 * Created by jair on 08/10/16.
 */

import express from 'express';
import { Server } from 'http';
import socketio from 'socket.io';
import User from './User';

const app = express();

app.use(express.static(__dirname + '/public'));

const server = Server(app);

const sio = socketio(server);

const allUsers = new Map();

sio.on('connection', (socket) => {
  const user = new User(socket, allUsers);
  user.start();
});

const port = 3000;

server.listen(port);

console.log(`Server listening on port ${port}`);
