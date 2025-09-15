// backend/routes/chatRoutes.js
import express from "express";
const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Chat route working!" });
});

export default router;
