import { Schema, Document } from "mongoose";

export interface IBoard {
    title: string;
    createdAt: Date;
    updatedAt: Date;
    userId: Schema.Types.ObjectId;
}

export interface IBoardDocument extends IBoard, Document {}
