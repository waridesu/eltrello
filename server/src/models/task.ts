import { model, Schema } from "mongoose";
import { IColumnDocument } from "../types/column.interface";
import { ITaskDocument } from "../types/task.interface";

const taskSchema = new Schema<ITaskDocument>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    boardId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    columnId: {
        type: Schema.Types.ObjectId,
        required: true,
    }
});
export default model<IColumnDocument>("Task", taskSchema);
