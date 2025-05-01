import Hotel from "../models/hotel.js";
import { authenticateAdmin } from "../middleware/authMiddleware.js"; // Import JWT middleware
import path from "path";
import fs from "fs";
// 🔹 Add a Hotel (Protected: Only Admins)
export const addHotel = async (req, res) => {
  try {
    console.log("Request received:", req.body);

    // Check if the admin is authenticated
    if (!req.admin || !req.admin.admin_id) {
      return res.status(401).json({ message: "Unauthorized: No admin token provided" });
    }
    
    const { trip_id, hotel_name, location, contact_number } = req.body;

    // Validate required fields
    if (!trip_id || !hotel_name || !location || !contact_number) {
      if (req.file) fs.unlinkSync(req.file.path); // Remove uploaded file if validation fails
      return res.status(400).json({ message: "All fields are required" });
    }

    let Hotel_image = null;
    if (req.file) {
      Hotel_image = `/uploads/hotels/${req.file.filename}`;
    } else {
      return res.status(400).json({ message: "Hotel image is required" });
    }

    // Create the new hotel entry
    const newHotel = await Hotel.create({
      trip_id,
      hotel_name,
      location,
      contact_number,
      Hotel_image,
    });

    res.status(201).json({ message: "Hotel added successfully", hotel: newHotel });

  } catch (error) {
    console.error("Error adding hotel:", error);

    if (req.file) fs.unlinkSync(req.file.path);

    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// 🔹 Get Hotels by Trip ID (Public Route)
export const getHotelByTrip = async (req, res) => {
  try {
    const { trip_id } = req.params;

    // Find hotels for the given trip_id
    const hotels = await Hotel.findAll({ where: { trip_id } });

    if (!hotels.length) {
      return res.status(404).json({ message: "No hotels found for this trip" });
    }

    res.status(200).json({ message: "Hotels retrieved successfully", hotels });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// 🔹 Delete a Hotel (Protected: Only Admins)
export const deleteHotel = async (req, res) => {
  try {
    // Authenticate admin first
    if (!req.admin || !req.admin.admin_id) {
      return res.status(401).json({ message: "Unauthorized: No admin token provided" });
    }

    const { hotel_id } = req.params;

    // Find the hotel by ID
    const hotel = await Hotel.findByPk(hotel_id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Delete the hotel
    await hotel.destroy();

    res.status(200).json({ message: "Hotel deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
// 🔹 Update a Hotel (Protected: Only Admins)
export const updateHotel = async (req, res) => {
  try {
    // Authenticate admin first
    if (!req.admin || !req.admin.admin_id) {
      return res.status(401).json({ message: "Unauthorized: No admin token provided" });
    }

    const { hotel_id } = req.params;
    const { trip_id, hotel_name, location, contact_number } = req.body;

    // Ensure trip_id is provided
    if (!trip_id) {
      return res.status(400).json({ message: "Trip ID is required for updating a hotel" });
    }

    // Find the hotel by ID
    const hotel = await Hotel.findByPk(hotel_id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Handle new image upload if provided
    let Hotel_image = hotel.Hotel_image;
    if (req.file) {
      // Delete the old image before saving new one
      if (hotel.Hotel_image) {
        const oldImagePath = path.join(process.cwd(), hotel.Hotel_image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      Hotel_image = `/uploads/hotels/${req.file.filename}`;
    }

    // Update hotel details
    await hotel.update({ trip_id, hotel_name, location, contact_number, Hotel_image });

    res.status(200).json({ message: "Hotel updated successfully", hotel });
  } catch (error) {
    console.error("Error updating hotel:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
