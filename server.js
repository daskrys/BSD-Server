import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors()); // enables CORS

const client_url = "https://daskrys.github.io/Socket-Prototype/";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174" || client_url,
    methods: ["GET", "POST"],
  },
});
let connected_users = 0;
let id;

io.on("connection", (socket) => {
  connected_users++;
  
  console.log("new user connected");
  
  io.emit('users_connected', connected_users);
  
  id = socket.id;

  socket.on("disconnect", () => {
    console.log("user disconnected")
    connected_users--;
  });
  
  // add event listeners
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

const port = 3000;
server.listen(port, () => console.log("server running on: port " + port));

// uncomment when using server, gonna deploy client on github pages
