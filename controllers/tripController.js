import Trip from "../models/trip.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// 🔹 Ensure "uploads" directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🔹 Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store images in "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// 🔹 Create a Trip with Image Upload (Protected: Only Admins)
export async function createTrip(req, res) {
  try {
    console.log("Request received:", req.body); 

    // Check if the admin is authenticated
    if (!req.admin || !req.admin.admin_id) {
      return res.status(401).json({ message: "Unauthorized: No admin token provided" });
    }

    const admin_id = req.admin.admin_id;
    const { trip_name, description, start_date, end_date, nights, days, meals, nightcamping, Trip_price } = req.body;

    // 🔹 Validate Required Fields
    if (!trip_name || !start_date || !end_date || !nights || !days || !Trip_price) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🔹 Convert Data Types
    const nightcampingBool = nightcamping === "true"; // Convert string to boolean
    const tripPriceFloat = parseFloat(Trip_price);
    let Trip_image = req.file ? `/uploads/${req.file.filename}` : null; // Handle image upload

    // 🔹 Create Trip in DB
    const newTrip = await Trip.create({
      admin_id,
      trip_name,
      description,
      start_date,
      end_date,
      nights: parseInt(nights, 10),
      days: parseInt(days, 10),
      meals,
      nightcamping: nightcampingBool,
      Trip_price: tripPriceFloat,
      Trip_image,
    });

    res.status(201).json({ message: "Trip created successfully", newTrip });
  } catch (error) {
    console.error("Error creating trip:", error);
    if (req.file) fs.unlinkSync(req.file.path); // Remove uploaded file on error
    res.status(500).json({ error: "Server error", details: error.message });
  }
}
// Export upload middleware for use in routes


// 🔹 Get All Trips (Public Route)
export async function allTrip(req, res) {
  try {
    const trips = await Trip.findAll();
    res.status(200).json({ message: "All trips retrieved successfully", trips });
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
}

// 🔹 Get a Trip by ID (Public Route)
export async function tripById(req, res) {
  try {
    const { id } = req.params;
    const trip = await Trip.findByPk(id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json({ message: "Trip retrieved successfully", trip });
  } catch (error) {
    console.error("Error fetching trip by ID:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
}

// 🔹 Update a Trip (Protected: Only Admins)
export const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const { trip_name, description, start_date, end_date, nights, days, meals, nightcamping, Trip_price } = req.body;

    const trip = await Trip.findByPk(id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Handle new image upload if provided
    let Trip_image = trip.Trip_image; // Keep old image if not updated
    if (req.file) {
      Trip_image = `/uploads/${req.file.filename}`;
    }

    await trip.update({ trip_name, description, start_date, end_date, nights, days, meals, nightcamping, Trip_price, Trip_image });

    res.status(200).json({ message: "Trip updated successfully", trip });
  } catch (error) {
    console.error("Error updating trip:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// 🔹 Delete a Trip (Protected: Only Admins)
export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findByPk(id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    await trip.destroy();
    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Export upload middleware for use in routes
export { upload };
