import express from "express"
import authRoutes from "./routes/auth.route.js"
import dotenv from "dotenv"
import connectDb from "./lib/db.js"
import cookieParser from "cookie-parser"

dotenv.config()
const app = express();
connectDb();
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 4001

app.use("/auth", authRoutes)

app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
})