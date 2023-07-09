import { model, Schema } from "mongoose";
import { IBoardDocument } from "../types/board.interface";

const boardSchema = new Schema<IBoardDocument>({
    title: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    }
});
export default model<IBoardDocument>("Boards", boardSchema);
