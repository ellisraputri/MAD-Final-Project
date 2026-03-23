import express from "express";
import { authenticate } from "../middleware/auth.js";
import { uploadMedia } from "../controller/media.js";

const mediaRouter = express.Router();

mediaRouter.post('/upload', authenticate, uploadMedia);

export default mediaRouter;
