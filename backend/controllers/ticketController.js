// src/controllers/ticketController.js
import Ticket from "../models/Ticket.js";

// Get all tickets (Admin/Agent)
export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("user", "name email")
      .populate("assignedAgent", "name email")
      .populate("statusChangedBy", "name email")
      .populate("raisedBy", "name email");;
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a ticket
export const createTicket = async (req, res) => {
  const { title, description, priority, user, assignedAgent, dueDate, status } = req.body;

  if (!title || !user) {
    return res.status(400).json({ message: "Title and user are required" });
  }

  try {
    let ticket = await Ticket.create({
      title,
      description: description || "",
      priority: priority || "Low",
      user,
      assignedAgent: assignedAgent || null,
      dueDate: dueDate || new Date(),
      status: status || "Open",
      raisedBy: req.user?._id || null, // whoever is creating the ticket
      statusChangedBy: null,
    });

    ticket = await ticket.populate([
      { path: "user", select: "name email" },
      { path: "assignedAgent", select: "name email" },
      { path: "raisedBy", select: "name email" }, // populate raisedBy
    ]);

    res.status(201).json(ticket);
  } catch (error) {
    console.error("Error creating ticket:", error.message);
    res.status(500).json({ message: "Failed to create ticket", error: error.message });
  }
};




export const updateTicketStatus = async (req, res) => {
  const { id } = req.params;
  const { status, assignedAgent } = req.body;

  try {
    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    if (status && status !== ticket.status) {
      ticket.status = status;
      ticket.statusChangedBy = req.user ? req.user._id : null;
    }

    if (assignedAgent !== undefined) {
      ticket.assignedAgent = assignedAgent || null;
    }

    const updatedTicket = await ticket.save();

    // Populate correctly with array syntax
  const populatedTicket = await updatedTicket.populate([
    { path: "user", select: "name email" },
    { path: "assignedAgent", select: "name email" },
    { path: "statusChangedBy", select: "name email" },
    { path: "raisedBy", select: "name email" }, // populate raisedBy
  ]);


    res.json(populatedTicket);
  } catch (error) {
    console.error("Error updating ticket:", error.message);
    res.status(500).json({ message: "Failed to update ticket", error: error.message });
  }
};
