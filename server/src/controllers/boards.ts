import { Response, NextFunction } from "express";
import BoardModel from "../models/board";
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import { Server, Socket } from "socket.io";
import { ISocket } from "../types/socket.interface";

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

export const joinBoard = async (io: Server, socket: ISocket, data: {boardId: string}) => {
    socket.join(data.boardId);
};

export const leaveBoard = async (io: Server, socket: ISocket, data: {boardId: string}) => {
    socket.leave(data.boardId);
};
