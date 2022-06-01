import { Express } from "express";
import { Socket } from "socket.io";
import { register_routes } from './routes/login';
import { super_database } from './database';
import { register_handlers,
  session_name
} from "./packages";

const { Server } = require('socket.io');
const express = require('express');

const app: Express = express();

const PORT: number | string = process.env.port ?? 4000;
const super_storage = new super_database();

app.use(express.json());
register_routes(app, super_storage);

const io = new Server(
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`)),
);

io.on('connection', (socket: Socket) => {
  const { user_name } = socket.handshake.query ?? null;
  console.log('Got connection from: ', user_name);

  register_handlers(socket, super_storage);

  io.to(session_name).emit(
    'get_all_notes',
    super_storage.get_all_notes(),
  );
});
