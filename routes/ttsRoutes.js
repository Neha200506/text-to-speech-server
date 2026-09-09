import express from "express";
import { healthCheck } from "../controllers/ttsController.js";

const router = express.Router();

router.get("/health", healthCheck);

export default router;