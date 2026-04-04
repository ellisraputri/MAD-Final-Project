import express from 'express';
import { generateDailySummary, getActivityRank, getGlobalRank } from '../controller/summary.js';
import { authenticate } from '../middleware/auth.js';

const summaryRouter = express.Router();

summaryRouter.post("/generate", async (req, res) => {
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

summaryRouter.get("/global", authenticate, getGlobalRank);
summaryRouter.get("/activity/:id", authenticate, getActivityRank);

export default summaryRouter;