import User from "../models/user.js";
import { sendOTP } from "../utils/nodemailer.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

// 🔹 Send OTP for Signup & Forgot Password
export const sendOtp = async (req, res) => {
  const { email, forResetPassword } = req.body;

  try {
    let user = await User.findOne({ where: { email } });

    if (!user && !forResetPassword) {
      // Create new user only during signup
      user = await User.create({ email, otp: null, isVerified: false, username: null });
    } else if (!user) {
      return res.status(400).json({ error: "Email not found!" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    await user.save();

    await sendOTP(email, otp);

    console.log(`📩 OTP sent to: ${email} | OTP: ${otp}`);
    res.json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error("❌ Error in sendOtp:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// 🔹 Verify OTP for Signup
export const verifyOtp = async (req, res) => {
  const { email, otp, username, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || user.otp !== otp) {
      console.log(`❌ OTP verification failed for ${email}`);
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.username = username;
    user.password = hashedPassword;
    user.isVerified = true;
    user.otp = null; // Clear OTP
    await user.save();

    console.log(`✅ User registered: ${username} | Email: ${email}`);
    res.json({ message: "Email verified and user registered successfully!" });
  } catch (error) {
    console.error("❌ Error in verifyOtp:", error);
    res.status(500).json({ error: "Verification failed" });
  }
};

// 🔹 Reset Password using OTP
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null; // Clear OTP
    await user.save();

    console.log(`✅ Password reset for: ${email}`);
    res.json({ message: "Password reset successful! You can now log in." });
  } catch (error) {
    console.error("❌ Error in resetPassword:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
};
