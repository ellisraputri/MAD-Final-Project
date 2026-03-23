import express from "express";
import { authenticate } from "../middleware/auth.js";
import { createTeam, editDetail, getDetail, joinTeam } from "../controller/team.js";

const teamRouter = express.Router();

teamRouter.post("/create", authenticate, createTeam);
teamRouter.post("/join", authenticate, joinTeam);
teamRouter.get("/detail/:id", authenticate, getDetail);
teamRouter.post("/edit", authenticate, editDetail);

export default teamRouter;
