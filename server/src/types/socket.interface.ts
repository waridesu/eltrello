import { Socket } from "socket.io";
import { IUserDocument } from "./user.interface";
export interface ISocket extends Socket {
    user?: IUserDocument;
}
