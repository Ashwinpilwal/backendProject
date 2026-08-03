import http from 'http';
import {Server} from 'socket.io'
import { app } from './app';

const PORT = process.env.PORT || 8000

const server = http.createServer(app)

const io = new Server(server)

server.listen(PORT, console.log(`Server is running on http://localhost:${PORT}`))