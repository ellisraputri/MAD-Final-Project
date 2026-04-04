import express from 'express';
import { generateDailySummary } from '../controller/summary';

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

export default summaryRouter;