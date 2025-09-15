// src/controllers/ticketController.js
import Ticket from "../models/Ticket.js";

// Get all tickets (Admin/Agent)
export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("user", "name email")
      .populate("assignedAgent", "name email")
      .populate("statusChangedBy", "name email");
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a ticket
export const createTicket = async (req, res) => {
  const { title, description, priority, user, assignedAgent, dueDate, status } = req.body;

  try {
    const ticket = await Ticket.create({
      title,
      description: description || "",
      priority: priority || "Low",
      user,
      assignedAgent: assignedAgent || null,
      dueDate: dueDate || new Date(),
      status: status || "Open",
      statusChangedBy: null,
    });

    const populatedTicket = await ticket
      .populate("user", "name email")
      .populate("assignedAgent", "name email");

    res.status(201).json(populatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update ticket status or assigned agent
export const updateTicketStatus = async (req, res) => {
  const { id } = req.params;
  const { status, assignedAgent } = req.body;

  try {
    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // Only update statusChangedBy if status changes
    if (status && status !== ticket.status) {
      ticket.status = status;
      ticket.statusChangedBy = req.user? req.user._id : null; // user making the change
    }

    // Update agent separately (does NOT affect statusChangedBy)
    if (assignedAgent) {
      ticket.assignedAgent = assignedAgent;
    }

    const updatedTicket = await ticket.save();

    const populatedTicket = await updatedTicket
      .populate("user", "name email")
      .populate("assignedAgent", "name email")
      .populate("statusChangedBy", "name email");

    res.json(populatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
