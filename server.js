
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

import ttsRoutes from "./routes/ttsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "https://text-to-speech-client-pvwlzh5ii-labmentix-cloud-drive.vercel.app",
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api", ttsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Text-to-Speech backend is running",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});