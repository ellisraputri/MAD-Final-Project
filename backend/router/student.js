import express from "express";
import {
  getDetail,
  login,
  register,
  updateDetail,
} from "../controller/student.js";
import { authenticate } from "../middleware/auth.js";

const studentRouter = express.Router();

studentRouter.post("/login", authenticate, login);
studentRouter.post("/register", authenticate, register);
studentRouter.get("/detail", authenticate, getDetail);
studentRouter.put("/update", authenticate, updateDetail);

export default studentRouter;
