import { followUser } from "../controller/User.controller.js";
import { socketAuthenticator } from "../middleware/Auth.js";
import cookieParser from "cookie-parser";

export default function initializeSocket(io) {
  const usersSocketIds = new Map();

  io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, (err) => {
      if (err) return next(err);
      socketAuthenticator(null, socket, next);
    });
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    const userId = socket.user.id;
    usersSocketIds.set(userId, socket.id);

    followUser(userId, usersSocketIds, socket, io);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      usersSocketIds.delete(userId);
    });
  });
}
