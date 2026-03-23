import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { db } from './config/firestore.js';
import studentRouter from './router/student.js';
import teamRouter from './router/team.js';
import resultRouter from './router/result.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send("Firebase API working"));
app.use("/api/auth", studentRouter);
app.use("/api/team", teamRouter);
app.use("/api/result", resultRouter);

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on ${PORT}`);
});