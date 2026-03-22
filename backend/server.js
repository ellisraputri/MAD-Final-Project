import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { db } from './config/firestore.js';


const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// API Endpoints
app.get('/', (req, res) => res.send("Firebase API working"));


app.listen(PORT, () => console.log(`Server started on ${PORT}`));