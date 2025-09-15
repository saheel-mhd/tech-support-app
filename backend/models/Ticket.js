import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"],
      default: "Open",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    statusChangedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // <--- add this
    dueDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
