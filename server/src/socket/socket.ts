import { Server } from "socket.io";
import { Server as HttpServer } from 'http';
import { SocketEventsEnum } from "../types/socket-events.enum";
import * as BoardController from "../controllers/boards";
import * as ColumnController from "../controllers/column";
import * as TaskController from "../controllers/task";
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
            socket.on(SocketEventsEnum.boardsJoin, (data) => {
                BoardController?.joinBoard(io, socket, data);
            });
            socket.on(SocketEventsEnum.boardsLeave, (data) => {
                BoardController?.leaveBoard(io, socket, data);
            });
            socket.on(SocketEventsEnum.columnsCreate, (data) => {
                ColumnController?.createColumn(io, socket, data);
            });
            socket.on(SocketEventsEnum.tasksCreate, (data) => {
                TaskController?.createTask(io, socket, data);
            });
            socket.on(SocketEventsEnum.boardsUpdate, (data) => {
                BoardController?.updateBoard(io, socket, data);
            });
            socket.on(SocketEventsEnum.boardsDelete, (data) => {
                BoardController?.deleteBoard(io, socket, data);
            });
            socket.on(SocketEventsEnum.columnsDelete, (data) => {
                ColumnController?.deleteColumn(io, socket, data);
            });

            socket.on(SocketEventsEnum.columnsUpdate, (data) => {
                ColumnController?.updateColumn(io, socket, data);
            });

            socket.on(SocketEventsEnum.tasksUpdate, (data) => {
                TaskController?.updateTask(io, socket, data);
            });

            socket.on(SocketEventsEnum.tasksDelete, (data) => {
                TaskController?.deleteTask(io, socket, data);
            });
        })
}
