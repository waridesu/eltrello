import { Schema, Document } from "mongoose";

export interface ITask {
    title: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    userId: Schema.Types.ObjectId;
    boardId: Schema.Types.ObjectId;
    columnId: Schema.Types.ObjectId;
}

export interface ITaskDocument extends ITask, Document {}
