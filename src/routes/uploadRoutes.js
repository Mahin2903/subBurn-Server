import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import { uploadVideo } from "../controllers/uploadControllers.js";

const router = express.Router();

router.post(
  "/video",
  upload.single("video"),
  uploadVideo
);

export default router;