import express from "express";
import { login } from "../controller/auth.js";
import { authenticate } from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/login", authenticate, login);

export default authRouter;
