import { model, Schema } from "mongoose";
import { IUserDocument } from "../types/user.interface";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new Schema<IUserDocument>({
        email: {
            type: String,
            required: [true, "Email is required"],
            validate: [validator.isEmail, "Please provide a valid email"],
            createIndexes: {unique: true},
        },
        username: {
            type: String,
            required: [true, "Username is required"],
        },
        password: {
            type: String,
            required: [true, "Username is required"],
            select: false,
        },
    },
    {timestamps: true}
);
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (err) {
        return next(err as Error);
    }
});
userSchema.methods.validatePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};
export default model<IUserDocument>("User", userSchema);
