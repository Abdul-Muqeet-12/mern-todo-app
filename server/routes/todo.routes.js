import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createTodo,
  getTodoById,
  getTodos,
} from "../controllers/todo.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createTodo);
router.get("/", authMiddleware, getTodos);
router.get("/:id", authMiddleware, getTodoById);

export default router;
