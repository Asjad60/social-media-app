import app from "./app.js";
import { createServer } from "http";

const server = createServer(app);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log("server connected on http://localhost:" + PORT);
});
