import express from "express";
import { authenticate } from "../middleware/auth.js";
import { generateDailySummary, getHighestRank, getLatestRank, getResultDetail, getResultList, getTopRanking, rate, submitResult } from "../controller/result.js";

const resultRouter = express.Router();

resultRouter.get("/rank/highest-by-team", authenticate, getHighestRank);
resultRouter.get("/rank/latest-by-team", authenticate, getLatestRank);
resultRouter.get("/rank/all", authenticate, getTopRanking);

resultRouter.get("/list", authenticate, getResultList);
resultRouter.get("/detail", authenticate, getResultDetail);
resultRouter.post("/submit", authenticate, submitResult);
resultRouter.post("/rating", authenticate, rate);

resultRouter.post("/generate-summary", async (req, res) => {
  try {
    // 🔐 Optional security
    const token = req.headers.authorization;
    if (token !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).send("Unauthorized");
    }

    await generateDailySummary();

    res.send("Summary generated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating summary");
  }
});

export default resultRouter;
