import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();
connectDB();

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@s.com" });
    if (adminExists) {
      console.log("Admin already exists!");
      process.exit();
    }

    const admin = await User.create({
      name: "Adin",
      email: "admin@s.com",
      password: "Admin@123", // will be hashed automatically
      role: "admin",
    });

    console.log("Adin created:", admin);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
