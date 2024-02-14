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
    //origin: "http://localhost:5174" || client_url, // for local development
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let next_player_num = 1;
const players = [];

io.on("connection", (socket) => {
  
  const player_number = next_player_num;
  players[socket.id] = player_number;
  
  // assign new player of their number
  socket.emit('player_number', player_number);
  
  console.log("new user connected");
  
  // update all clients
  io.emit('users_connected', Object.keys(players).length);
  

  socket.on("disconnect", () => {
    console.log("user disconnected")
    
    delete players[socket.id];
    
    // update all clients
    io.emit('users_connected', Object.keys(players).length);
  });
  
  // add event listeners
});

app.get("/", (req, res) => {
  res.send("Bite-Sized Server");
});

const port = 3000;
server.listen(port, () => console.log("server running on: port " + port));