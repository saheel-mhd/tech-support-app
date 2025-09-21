// src/controllers/ticketController.js
import mongoose from "mongoose";
import Ticket from "../models/Ticket.js";

// Get all tickets (Admin/Agent)
export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("user", "name email")
      .populate("raisedBy", "name email")
      .populate("assignedAgent", "name email")
      .populate("statusChangedBy", "name email");

    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create a ticket
export const createTicket = async (req, res) => {
  const { title, description, priority, user, assignedAgent, dueDate, status } = req.body;

  if (!title || !user) {
    return res.status(400).json({ message: "Title and user are required" });
  }

  const validStatus = ["Open", "In Progress", "Closed"];
  const ticketStatus = validStatus.includes(status) ? status : "Open";

  const validPriority = ["Low", "Medium", "High"];
  const ticketPriority = validPriority.includes(priority) ? priority : "Low";

  try {
    const ticket = await Ticket.create({
      title,
      description: description || "",
      priority: ticketPriority,
      user, // user for whom the ticket is raised
      raisedBy: req.user._id, // user/admin who raised it
      assignedAgent: assignedAgent || null,
      dueDate: dueDate ? new Date(dueDate) : new Date(),
      status: ticketStatus,
      statusChangedBy: null,
    });

    const populatedTicket = await ticket.populate([
      { path: "user", select: "name email" },
      { path: "raisedBy", select: "name email" },
      { path: "assignedAgent", select: "name email" },
    ]);

    res.status(201).json(populatedTicket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update ticket status or assigned agent
export const updateTicketStatus = async (req, res) => {
  const { id } = req.params;
  const { status, assignedAgent } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ticket ID" });
  }

  try {
    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // Update status
    if (status && status !== ticket.status) {
      const validStatus = ["Open", "In Progress", "Closed"];
      if (!validStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      ticket.status = status;
      ticket.statusChangedBy = req.user._id;
    }

    // Update assigned agent
    if (assignedAgent) {
      if (!mongoose.Types.ObjectId.isValid(assignedAgent)) {
        return res.status(400).json({ message: "Invalid agent ID" });
      }
      ticket.assignedAgent = mongoose.Types.ObjectId(assignedAgent);
    } else {
      ticket.assignedAgent = null;
    }

    const updatedTicket = await ticket.save();

    const populatedTicket = await updatedTicket.populate([
      { path: "user", select: "name email" },
      { path: "raisedBy", select: "name email" },
      { path: "assignedAgent", select: "name email" },
      { path: "statusChangedBy", select: "name email" },
    ]);

    res.json(populatedTicket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ message: error.message });
  }
};
