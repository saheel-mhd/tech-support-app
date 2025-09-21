import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();
connectDB();

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "age@example.com" });
    if (adminExists) {
      console.log("Admin already exists!");
      process.exit();
    }

    const admin = await User.create({
      name: "Agent1",
      email: "age@example.com",
      password: "Admin@123", // will be hashed automatically
      role: "agent",
    });

    console.log("Agent created:", agent);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
