import mongoose from "mongoose";
import dotenv from "dotenv";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const createSampleTicket = async () => {
  await connectDB();

  // Find an existing user
  const user = await User.findOne({ role: "user" });
  if (!user) {
    console.log("No user found. Create a user first.");
    process.exit();
  }

  const ticket = await Ticket.create({
    title: "Sample Issue",
    description: "This is a test ticket",
    user: user._id,
  });

  console.log("Sample ticket created:", ticket);
  process.exit();
};

createSampleTicket();
