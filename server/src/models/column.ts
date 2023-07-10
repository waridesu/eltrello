import { model, Schema } from "mongoose";
import { IColumnDocument } from "../types/column.interface";
import column from "./column";

const columnSchema = new Schema<IColumnDocument>({
    title: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    boardId: {
        type: Schema.Types.ObjectId,
        required: true,
    }
});
export default model<IColumnDocument>("Column", columnSchema);
