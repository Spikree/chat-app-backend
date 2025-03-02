import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import connectDb from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/Socket.js";

dotenv.config();
connectDb();

// Updated body-parser configuration
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
const port = process.env.PORT || 4001;

app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);

server.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});