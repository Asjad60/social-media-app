import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";
import { connectDB } from "./config/DBconnection.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import PostRoute from "./routes/PostRoute.js";
import CommentRoute from "./routes/CommentRoute.js";
import LikesRoute from "./routes/LikesRoute.js";
import ProfileRoutes from "./routes/ProfileRoutes.js";
import { ConnectCloudinary } from "./config/cloudinary.js";
import cookieParser from "cookie-parser";

const app = express();
connectDB();
ConnectCloudinary();

app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "https://9f6qq33r-5173.inc1.devtunnels.ms",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/likes", LikesRoute);
app.use("/api/v1/posts", PostRoute);
app.use("/api/v1/comments", CommentRoute);
app.use("/api/v1/profile", ProfileRoutes);

app.get("/", (req, res) => {
  res.send("<h1> Hey buddy i am from server </h1>");
});

export default app;
