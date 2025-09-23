import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();
connectDB();

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "agent@3.com" });
    if (adminExists) {
      console.log("Admin already exists!");
      process.exit();
    }

    const admin = await User.create({
      name: "Agent3",
      email: "agent@3.com",
      password: "Agent@123", // will be hashed automatically
      role: "agent",
    });

    console.log("Agent created:", admin);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
