import express from "express";
import { authenticate } from "../middleware/auth.js";
import { getResultDetail, getResultList, rate, submitResult } from "../controller/result.js";

const resultRouter = express.Router();

resultRouter.get("/list", authenticate, getResultList);
resultRouter.get("/detail", authenticate, getResultDetail);
resultRouter.post("/submit", authenticate, submitResult);
resultRouter.post("/rating", authenticate, rate);

export default resultRouter;
