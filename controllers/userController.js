import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {authenticateUser} from "../middleware/authMiddleware.js"; // Import JWT Middleware

dotenv.config();

// 🔹 Register a New User
export async function registerUser(req, res) {
  try {
    
    const { username, email, password } = req.body;
    console.log(username, email, password)
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully", user: { id: newUser.user_id, username, email } });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}

// 🔹 Login User & Generate Token
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token valid for 1 hour
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.user_id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// 🔹 Get User Profile (Protected)
export const profileUser = async (req, res) => {
  try {
    authenticateUser(req, res, async () => {
      const userId = req.user.userId; // Get user ID from token

      // Fetch user from the database
      const user = await User.findByPk(userId, {
        attributes: ["user_id", "username", "email"], // Only return necessary fields
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ user });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
