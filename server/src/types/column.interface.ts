import { Schema, Document } from "mongoose";

export interface IColumn {
    title: string;
    createdAt: Date;
    updatedAt: Date;
    userId: Schema.Types.ObjectId;
    boardId: Schema.Types.ObjectId;
}

export interface IColumnDocument extends IColumn, Document {}
