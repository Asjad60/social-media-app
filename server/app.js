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
import StoryRoutes from "./routes/StoryRoutes.js";
import { ConnectCloudinary } from "./config/cloudinary.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { limiter } from "./config/rateLimiter.js";
// import passport from "passport";
import { configurePassport } from "./config/passport.js";
import errorMiddleware from "./middleware/Error.middleware.js";

const app = express();
connectDB();
ConnectCloudinary();

let passport;
try {
  passport = configurePassport();
} catch (error) {
  console.error("Failed to configure passport:", error);
  process.exit(1);
}

app.use(helmet());
app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(limiter);

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/likes", LikesRoute);
app.use("/api/v1/posts", PostRoute);
app.use("/api/v1/comments", CommentRoute);
app.use("/api/v1/profile", ProfileRoutes);
app.use("/api/v1/stories", StoryRoutes);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("<h1> Hey buddy i am from server </h1>");
});

export default app;
