import { ExpressRequestInterface } from "../types/expressRequest.interface";
import { NextFunction, Response } from "express";
import ColumnModel from "../models/column";

export const getColumns = async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
        if (!req.user) return res.status(401).json({message: "Unauthorized"});
        const columns = await ColumnModel.find({boardId: req.params.boardId});
        res.send(columns);
    } catch (err) {
        next(err);
    }
};
