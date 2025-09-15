// src/controllers/ticketController.js
import mongoose from "mongoose";
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

  // Validate required fields
  if (!title || !user) {
    return res.status(400).json({ message: "Title and user are required" });
  }

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(user)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  if (assignedAgent && !mongoose.Types.ObjectId.isValid(assignedAgent)) {
    return res.status(400).json({ message: "Invalid assigned agent ID" });
  }

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
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "Failed to create ticket", error: error.message });
  }
};

// Update ticket status or assigned agent
export const updateTicketStatus = async (req, res) => {
  const { id } = req.params;
  const { status, assignedAgent } = req.body;

  try {
    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    if (status && status !== ticket.status) {
      ticket.status = status;
      ticket.statusChangedBy = req.user?._id || null;
    }

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
