import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

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

const createSampleAgent = async () => {
  await connectDB();

  const hashedPassword = await bcrypt.hash("agent123", 10);

  const agent = await User.create({
    name: "Test Agent",
    email: "agent@test.com",
    password: hashedPassword,
    role: "agent",
  });

  console.log("Sample agent created:", agent);
  process.exit();
};

createSampleAgent();
