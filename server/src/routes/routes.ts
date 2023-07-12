import express from 'express'

import * as UserController from "../controllers/user";
import * as BoardController from "../controllers/boards";
import * as ColumnController from "../controllers/column";
import * as TaskController from "../controllers/task";
import authMiddleware from "../midlewares/auth";


export const router = express.Router();

//User routes
router.post('/api/users', UserController.register);
router.post('/api/users/login', UserController.login);
router.get('/api/user', authMiddleware, UserController.currentUser);
// board routes
router.get('/api/boards', authMiddleware, BoardController.getBoards);
router.post('/api/boards', authMiddleware, BoardController.createBoard);
router.get('/api/boards/:boardId', authMiddleware, BoardController.getBoard);
router.get('/api/boards/:boardId/columns', authMiddleware, ColumnController.getColumns);
router.get('/api/boards/:boardId/tasks', authMiddleware, TaskController.getTasks);

