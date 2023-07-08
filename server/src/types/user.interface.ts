import { Document } from 'mongoose';
export interface IUser {
    email: string;
    username: string;
    password: string;
    createdAt: Date;
}

export interface IUserDocument extends IUser, Document {
    validatePassword(password: string): Promise<boolean>;
}
