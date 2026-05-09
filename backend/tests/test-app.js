import express from "express";
import multer from "multer";

import {
  uploadMedia,
  uploadToCloudinary,
} from "../controller/media.js";
import {
  getResultList,
  getResultDetail,
  submitResult,
  rate,
} from "../controller/result.js";
import {
  login,
  register,
  getDetail,
  updateDetail,
} from "../controller/student.js";
import {
  getGlobalRank,
  getActivityRank,
} from "../controller/summary.js";
import {
  createTeam,
  joinTeam,
  getTeamDetail,
  editDetail,
  getDetailBatch,
} from "../controller/team.js";

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    uid: "user123",
    email: "test@mail.com",
  };

  next();
});

const upload = multer();

app.post("/media", uploadMedia);
app.post(
  "/cloudinary",
  upload.single("file"),
  uploadToCloudinary
);

app.get("/results", getResultList);
app.get("/result", getResultDetail);
app.post("/result", submitResult);
app.post("/rate", rate);

app.get("/login", login);
app.post("/register", register);
app.get("/detail", getDetail);
app.put("/detail", updateDetail);

app.get("/summary/global", getGlobalRank);
app.get("/summary/activity/:id", getActivityRank);

app.post("/team/create", createTeam);
app.post("/team/join", joinTeam);
app.get("/team/:id", getTeamDetail);
app.put("/team/edit", editDetail);
app.post("/team/batch", getDetailBatch);

export default app;