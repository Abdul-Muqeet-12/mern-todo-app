import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createTodo } from "../controllers/todo.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createTodo);

export default router;
