import express from "express";
import { login, register } from "../controller/auth.js";
import { authenticate } from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/login", authenticate, login);
authRouter.post("/register", authenticate, register);

export default authRouter;
