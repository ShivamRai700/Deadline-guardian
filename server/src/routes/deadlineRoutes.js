import express from "express";
import Deadline from "../models/Deadline.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();
router.use(auth);

router.get("/", async (req, res) => {
  try {
    const query = { user: req.userId };
    const { status, priority } = req.query;

    if (status && status !== "all") {
      query.status = status;
    }
    if (priority && priority !== "all") {
      query.priority = priority;
    }

    const items = await Deadline.find(query).sort({ deadlineDate: 1 });
    return res.json(items);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const payload = { ...req.body, user: req.userId };
    const item = await Deadline.create(payload);
    return res.status(201).json(item);
  } catch {
    return res.status(400).json({ message: "Invalid data" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const item = await Deadline.findOneAndUpdate({ _id: req.params.id, user: req.userId }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.json(item);
  } catch {
    return res.status(400).json({ message: "Invalid data" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const item = await Deadline.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.json({ message: "Deleted" });
  } catch {
    return res.status(400).json({ message: "Invalid request" });
  }
});

export default router;
