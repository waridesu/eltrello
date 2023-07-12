import { Response, NextFunction } from "express";
import BoardModel from "../models/board";
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import { Server } from "socket.io";
import { ISocket } from "../types/socket.interface";
import { SocketEventsEnum } from "../types/socket-events.enum";
import { getErrorMessage } from "../helper/helper";

export const getBoards = async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
        if (!req.user) return res.status(401).json({message: "Unauthorized"});
        const boards = await BoardModel.find({userId: req.user._id});
        res.send(boards);
    } catch (err) {
        next(err);
    }
};

export const createBoard = async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
        if (!req.user) return res.status(401).json({message: "Unauthorized"});
        const newBoard = new BoardModel({title: req.body.title, userId: req.user.id});
        const savedBoard = await newBoard.save();
        res.send(savedBoard);
    } catch (err) {
        next(err);
    }
};
export const getBoard = async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
        if (!req.user) return res.status(401).json({message: "Unauthorized"});
        const board = await BoardModel.findById(req.params.boardId);
        res.send(board);
    } catch (err) {
        next(err);
    }
};

export const joinBoard = async (io: Server, socket: ISocket, data: { boardId: string }) => {
    socket.join(data.boardId);
};

export const leaveBoard = async (io: Server, socket: ISocket, data: { boardId: string }) => {
    socket.leave(data.boardId);
};

export const updateBoard = async (io: Server, socket: ISocket, data: {
    boardId: string,
    fields: { title: string }
}) => {
    try {
        if (!socket.user) {
            socket.emit(SocketEventsEnum.boardsUpdateFailure, 'Unauthorized');
            return;
        }
        const updatedBoard =
            await BoardModel.findByIdAndUpdate(data.boardId, data.fields, {new: true});
        io.to(data.boardId).emit(SocketEventsEnum.boardsUpdateSuccess, updatedBoard);
    } catch (err) {
        socket.emit(SocketEventsEnum.boardsUpdateFailure, getErrorMessage(err));
    }
};
export const deleteBoard = async (io: Server, socket: ISocket, data: { boardId: string }) => {
    try {
        if (!socket.user) {
            socket.emit(SocketEventsEnum.boardsDeleteFailure, 'Unauthorized');
            return;
        }
        await BoardModel.deleteOne({_id: data.boardId});
        io.to(data.boardId).emit(SocketEventsEnum.boardsDeleteSuccess);
    } catch (err) {
        socket.emit(SocketEventsEnum.boardsDeleteFailure, getErrorMessage(err));
    }
};
