import Admin from '../models/admin.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); 

export async function registerAdmin(req, res) {
    try {
        const { username, email, password } = req.body;

        
        const existingAdmin = await Admin.findOne({ where: { email } });
        if (existingAdmin) {
            return res.status(400).json({ message: "Email already registered!" });
        }

    
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin with the hashed password
        const admin = await Admin.create({
            username,
            email,
            password: hashedPassword, // Store hashed password
        });

        res.status(201).json({ admin, message: "Admin registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Admin Login
export async function loginAdmin(req, res) {
    try {
        const { email, password } = req.body;

        console.log("Email received:", email);
        console.log("Password received:", password);

        // Find admin by email
        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        console.log("Admin found:", admin);  

        // Compare passwords
        const isMatch = await bcrypt.compare(password, admin.password);
        console.log("Password match:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { admin_id: admin.admin_id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful!", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Protected Route for Admin Profile
export async function profileAdmin(req, res) {
    try {
        const admin = await Admin.findByPk(req.admin.admin_id);

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json({ admin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
