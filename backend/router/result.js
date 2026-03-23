import express from "express";
import { authenticate } from "../middleware/auth.js";
import { getHighestRank, getLatestRank, getResultDetail, getResultList, getTopRanking } from "../controller/result.js";

const resultRouter = express.Router();

resultRouter.get("/rank/highest-by-team", authenticate, getHighestRank);
resultRouter.get("/rank/latest-by-team", authenticate, getLatestRank);
resultRouter.get("/rank/all", authenticate, getTopRanking);

resultRouter.get("/list", authenticate, getResultList);
resultRouter.get("/detail", authenticate, getResultDetail);

export default resultRouter;
