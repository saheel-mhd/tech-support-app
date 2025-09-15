import express from "express";
import { getTickets, createTicket, updateTicketStatus } from "../controllers/ticketController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin can view all tickets
router.get("/", protect, admin, getTickets);

// User can create ticket
router.post("/", protect, createTicket);

// Admin/Agent can update status
router.put("/:id", protect, updateTicketStatus);


// tickets count 
router.get("/counts", async (req, res) => {
  try {
    const totalDone = await Ticket.countDocuments({ status: "done" });
    const totalPending = await Ticket.countDocuments({ status: "pending" });
    const totalOngoing = await Ticket.countDocuments({ status: "ongoing" });
    res.json({ totalDone, totalPending, totalOngoing });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch counts" });
  }
});



export default router;
