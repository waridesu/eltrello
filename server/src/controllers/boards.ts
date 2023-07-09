import {Response, NextFunction} from "express";
import BoardModel from "../models/board";
import { ExpressRequestInterface } from "../types/expressRequest.interface";

export  const getBoards = async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
        if (!req.user) return res.status(401).json({message: "Unauthorized"});
        console.log(req.user._id);
        const boards = await BoardModel.find(/*{userId: req.user._id}*/);
        res.send(boards);
    } catch (err) {
        next(err);
    }
};
