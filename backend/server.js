import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';

import { db } from './config/firestore.js';
import studentRouter from './router/student.js';
import teamRouter from './router/team.js';
import resultRouter from './router/result.js';
import mediaRouter from './router/media.js';
import { registerTeamSocket } from './config/socket.js';

const app = express();
const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});
registerTeamSocket(io); 

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send("Firebase API working"));
app.use("/api/auth", studentRouter);
app.use("/api/team", teamRouter);
app.use("/api/result", resultRouter);
app.use("/api/media", mediaRouter);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server + Socket running on ${PORT}`);
});