// backend/routes/userRoutes.js
import express from "express";
import { protect, adminOrAgent } from "../middleware/authMiddleware.js";
import { getUsers, createUser, deleteUser, updateUser } from "../controllers/userController.js";


const router = express.Router();

// Admin can view all users
router.get("/",  getUsers);

// Admin can create a new user
router.post("/", protect, adminOrAgent, createUser);

// Admin can delete a user
router.delete("/:id", protect, adminOrAgent, deleteUser);

// admin can edit a user
router.put("/:id", updateUser);


export default router;