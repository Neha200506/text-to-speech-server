
import express from "express";

import {
  getHistory,
  saveHistory,
  toggleFavorite,
  deleteHistory,
} from "../controllers/historyController.js";

import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// All history routes require authentication
router.use(authenticateUser);

// Get all history
router.get("/", getHistory);

// Save a new speech item
router.post("/", saveHistory);

// Toggle favorite status
router.patch("/:id/favorite", toggleFavorite);

// Delete history item
router.delete("/:id", deleteHistory);

export default router;