import express from "express";
import { auth } from "../middleware/auth.js";
import { getAIPrioritySuggestion } from "../services/aiService.js";

const router = express.Router();

router.use(auth);

router.post("/priority", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({
        improvedTitle: title || "Untitled",
        description: description || "",
        priority: "medium",
      });
    }

    const suggestion = await getAIPrioritySuggestion(title, description || "");

    return res.json(suggestion);
  } catch (error) {
    console.error("AI route error:", error);
    return res.json({
      improvedTitle: req.body.title || "Untitled",
      description: req.body.description || "",
      priority: "medium",
    });
  }
});

export default router;
