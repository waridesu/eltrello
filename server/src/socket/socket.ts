import { Server } from "socket.io";
import { Server as HttpServer } from 'http';
export default function setupSocketIoServer(httpsServer: HttpServer) {
    const io = new Server(httpsServer);
    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('chat message', (msg) => {
            console.log('message: ' + msg);
        });
    })
}
