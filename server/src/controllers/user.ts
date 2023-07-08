import { NextFunction, Request, Response } from 'express';
import UserModel from '../models/user';
import { IUserDocument } from "../types/user.interface";
import { Error } from "mongoose";
import jwt from "jsonwebtoken";
import { secret } from "../config";
import { ExpressRequestInterface } from "../types/expressRequest.interface";

const normalizeUser = (user: IUserDocument) => {
    const token = jwt.sign({id: user.id, email: user.email}, secret, {});
    return {
        email: user.email,
        username: user.username,
        id: user.id,
        token
    }
}
export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser = new UserModel({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });
        console.log('new user', newUser);
        const saveUser = await newUser.save();
        res.send(normalizeUser(saveUser))
        console.log('saved user', saveUser);
    } catch (err) {
        if (err instanceof Error.ValidationError) {
            const messages = Object.values(err.errors).map((val) => val.message);
            return res.status(422).json(messages);
        }
        next(err);
    }
};
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserModel.findOne({email: req.body.email}).select("+password");
        const errors = {emailOrPassword: "Invalid email or password"};
        if (!user) return res.status(422).json(errors);
        const isSamePassword = await user.validatePassword(req.body.password);
        if (!isSamePassword) return res.status(422).json(errors);
        res.send(normalizeUser(user))
    } catch (err) {
        next(err);
    }
};

export const currentUser = async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    if (!req.user) return res.sendStatus(401);
    res.send(normalizeUser(req.user))
};
