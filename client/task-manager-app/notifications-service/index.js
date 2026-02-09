import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", () => {
  console.log("Cliente conectado");
});

app.post("/notify", (req, res) => {
  io.emit("notification", req.body.message);
  res.send("ok");
});

server.listen(5000, () => {
  console.log("SERVIDOR NOTIFICACIONES EN 5000");
});