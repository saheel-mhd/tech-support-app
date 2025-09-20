// ./routes/ticketRoutes.js
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
// now it take the the counts locally without api
// router.get("/counts", protect, async (req, res) => {
//   try {
//     const totalDone = await Ticket.countDocuments({ status: "Closed" });
//     const totalPending = await Ticket.countDocuments({ status: "Open" });
//     const totalOngoing = await Ticket.countDocuments({ status: "In Progress" });
//     res.json({ totalDone, totalPending, totalOngoing });
//   } catch (err) {
//     console.error("Error fetching counts:", err);
//     res.status(500).json({ error: "Failed to fetch counts" });
//   }
// });




export default router;
