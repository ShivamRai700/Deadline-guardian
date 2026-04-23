import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import deadlineRoutes from "./routes/deadlineRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();

if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
  console.error("Missing JWT_SECRET or MONGO_URI in .env");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://deadline-guardian-rosy.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) =>
  res.json({
    ok: true,
    dbConnected: mongoose.connection.readyState === 1,
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/deadlines", deadlineRoutes);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

async function connectWithRetry() {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    console.log("Retrying MongoDB connection in 5 seconds...");
    setTimeout(connectWithRetry, 5000);
  }
}

connectWithRetry();
