import express from "express";
import { authenticate } from "../middleware/auth.js";
import { uploadMedia, uploadToCloudinary } from "../controller/media.js";
import { upload } from "../middleware/upload.js";

const mediaRouter = express.Router();

mediaRouter.post('/upload', authenticate, uploadMedia);
mediaRouter.post(
  "/upload-cloudinary",
  authenticate,
  upload.single("file"), 
  uploadToCloudinary
);

export default mediaRouter;
