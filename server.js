import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import ttsRoutes from "./routes/ttsRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api", ttsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});