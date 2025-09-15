// backend/routes/userRoutes.js
import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { getUsers, createUser, deleteUser, updateUser } from "../controllers/userController.js";


const router = express.Router();

// Admin can view all users
router.get("/", protect, admin, getUsers);

// Admin can create a new user
router.post("/", protect, admin, createUser);

// Admin can delete a user
router.delete("/:id", protect, admin, deleteUser);

// admin can edit a user
router.put("/:id", updateUser);


export default router;
