import { Request } from 'express';
import { IUserDocument } from "./user.interface";

export interface ExpressRequestInterface extends Request {
    user?: IUserDocument;
}
