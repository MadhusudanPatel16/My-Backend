import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// 🔹 Admin Authentication Middleware
export const authenticateAdmin = (req, res, next) => {
    try {
        console.log("Admin Auth Headers:", req.headers);

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("No admin token provided");
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const token = authHeader.split(" ")[1]; // Extract token after "Bearer "
        console.log("Extracted Admin Token:", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Admin:", decoded);

        req.admin = decoded; // Store admin info in request object
        next();
    } catch (error) {
        console.error("Admin Token Error:", error.message);
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

// 🔹 User Authentication Middleware
export const authenticateUser = (req, res, next) => {
    try {
        console.log("User Auth Headers:", req.headers);

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("No user token provided");
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1]; // Extract token after "Bearer "
        console.log("Extracted User Token:", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded User:", decoded);

        req.user = decoded; // Store user info in request object
        next();
    } catch (error) {
        console.error("User Token Error:", error.message);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
