import express from "express";
import { authenticate } from "../middleware/auth.js";
import { getHighestRank, getLatestRank, getTopRanking } from "../controller/result.js";

const resultRouter = express.Router();

resultRouter.get("/highest-by-team", authenticate, getHighestRank);
resultRouter.get("/latest-by-team", authenticate, getLatestRank);
resultRouter.get("/all", authenticate, getTopRanking);

export default resultRouter;
