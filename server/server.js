import { Server } from "socket.io";
import app from "./app.js";
import { createServer } from "http";
import initializeSocket from "./config/socketio.js";
import errorMiddleware, { AppError } from "./middleware/Error.middleware.js";

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

initializeSocket(io);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log("server connected on http://localhost:" + PORT);
});
