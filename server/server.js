import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import todoRoutes from "./routes/todo.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use("/api/auth", authRouter);
app.use("/api/todos", todoRoutes);

app.listen(PORT, () => {
  console.log(`Server started on PORT:${PORT}`);
});
