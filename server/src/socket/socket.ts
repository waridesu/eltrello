import { Server } from "socket.io";
import { Server as HttpServer } from 'http';
import { SocketEventsEnum } from "../types/socket-events.enum";
import * as BoardController from "../controllers/boards";
import jwt from "jsonwebtoken";
import { secret } from "../config";
import User from "../models/user";
import { ISocket } from "../types/socket.interface";
export default function setupSocketIoServer(httpsServer: HttpServer) {
    const io = new Server(httpsServer, {
        cors: {origin: '*'}
    });
    io.use(async (socket: ISocket, next) => {
        try {
            const token = socket.handshake.auth.token ?? '';
            const data = jwt.verify(token.split(' ')[1], secret) as {
                id: string;
                email: string;
            }
            const user = await User.findById(data.id);
            if (!user) return next(new Error('Authentication error'));
            socket.user = user;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    })
        .on('connection', (socket) => {
            console.log('a user connected');
            socket.on('chat message', (msg) => {
                console.log('message: ' + msg);
            });

            socket.on(SocketEventsEnum.boardsJoin, (data) => {
                BoardController.joinBoard(io, socket, data);
            });
            socket.on(SocketEventsEnum.boardsLeave, (data) => {
                BoardController.leaveBoard(io, socket, data);
            });
        })
}
