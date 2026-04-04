import express from "express";
import { authenticate } from "../middleware/auth.js";
import { getHighestRank, getLatestRank, getResultDetail, getResultList, getTopRanking, rate, submitResult } from "../controller/result.js";

const resultRouter = express.Router();

resultRouter.get("/rank/highest-by-team", authenticate, getHighestRank);
resultRouter.get("/rank/latest-by-team", authenticate, getLatestRank);
resultRouter.get("/rank/all", authenticate, getTopRanking);

resultRouter.get("/list", authenticate, getResultList);
resultRouter.get("/detail", authenticate, getResultDetail);
resultRouter.post("/submit", authenticate, submitResult);
resultRouter.post("/rating", authenticate, rate);

export default resultRouter;
