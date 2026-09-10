import express from "express";
import { healthCheck, testTTS } from "../controllers/ttsController.js";

const router = express.Router();

router.get("/health", healthCheck);
router.post("/tts", testTTS);

export default router;
