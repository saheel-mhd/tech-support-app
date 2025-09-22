// ./routes/ticketRoutes.js
import express from "express";
import { getTickets, createTicket, updateTicketStatus } from "../controllers/ticketController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin can view all tickets
router.get("/", protect, getTickets);

// User can create ticket
router.post("/", protect, createTicket);

// Admin/Agent can update status
router.put("/:id", protect, updateTicketStatus);





export default router;
