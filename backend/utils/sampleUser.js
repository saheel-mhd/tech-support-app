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

const createSampleUser = async () => {
  await connectDB();

  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = await User.create({
    name: "Test User",
    email: "user@test.com",
    password: hashedPassword,
    role: "user",
  });

  console.log("Sample user created:", user);
  process.exit();
};

createSampleUser();
