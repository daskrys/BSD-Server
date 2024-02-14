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
const players = {};
const player_nums = {};

io.on("connect", (socket) => {
  
  const player_number = next_player_num;
  player_nums[socket.id] = next_player_num;
  next_player_num++;
  
  players[socket.id] = {
      player_id: socket.id,
      x: 500,
      y: 500,
      animation: 'walk_t',
  };
  
  socket.emit('current_players', players); // send players info
  
  socket.emit('player_number', player_number); // send player number
  
  socket.broadcast.emit('new_player', players[socket.id]);
  console.log("new user connected");
  
  io.emit('users_connected', Object.keys(players).length); // update all clients
  
  socket.on('player_movement', (movement_data) => {
        players[socket.id].x = movement_data.x;
        players[socket.id].y = movement_data.y;
        players[socket.id].animation = movement_data.animation;
        // Broadcast updated position to all other players
        socket.broadcast.emit('player_moved', players[socket.id]);
    });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    
    delete player_nums[socket.id];
    delete players[socket.id];
    
    io.emit('disconnected', socket.id);
    io.emit('users_connected', Object.keys(players).length);
  });
  
  // add event listeners
});

app.get("/", (req, res) => {
  res.send("Bite-Sized Server");
});

const port = 3000;
server.listen(port, () => console.log("server running on: port " + port));