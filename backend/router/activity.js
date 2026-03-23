import express from "express";
import { authenticate } from "../middleware/auth.js";
import { getList } from "../controller/activity.js";

const activityRouter = express.Router();

activityRouter.get("/list", authenticate, getList);

export default activityRouter;
