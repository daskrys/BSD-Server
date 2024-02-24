import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors()); // enables CORS

const client_url = "";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    //origin: "http://localhost:5173" || client_url, // for local development
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Bite-Sized Server");
});

const port = 3000;
server.listen(port, () => console.log("server running on: port " + port));
