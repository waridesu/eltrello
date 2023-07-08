import express from 'express'

import * as UserController from "../controllers/user";
import authMiddleware from "../midlewares/auth";


export const router = express.Router();

//User routes
router.post('/api/users', UserController.register);
router.post('/api/users/login', UserController.login);
router.get('/api/user', authMiddleware, UserController.currentUser);


