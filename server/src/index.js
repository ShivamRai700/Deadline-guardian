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
const port = process.env.PORT || 5000;

const corsOptions = {
  origin(origin, callback) {
    // Allow same-origin/non-browser calls (curl, server-to-server) and local Vite dev origins.
    if (!origin) {
      return callback(null, true);
    }
    if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/api/health", (_req, res) =>
  res.json({
    ok: true,
    dbConnected: mongoose.connection.readyState === 1,
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/deadlines", deadlineRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

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
