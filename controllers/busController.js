import Bus from "../models/bus.js";
import { authenticateAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";
import path from "path";
import fs from "fs";

// 🔹 Add New Bus (with Image Upload)
export const addBus = async (req, res) => {
  try {
    console.log("Request received:", req.body);

    // Check if the admin is authenticated
    if (!req.admin || !req.admin.admin_id) {
      return res.status(401).json({ message: "Unauthorized: No admin token provided" });
    }

    const { trip_id, bus_number, seating_capacity, driver_name, contact_number } = req.body;

    // 🔹 Validate Required Fields
    if (!trip_id || !bus_number || !seating_capacity || !driver_name || !contact_number) {
      if (req.file) fs.unlinkSync(req.file.path); // Remove uploaded file if validation fails
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔹 Handle File Upload
    let Bus_image = null;
    if (req.file) {
      Bus_image = `/uploads/buses/${req.file.filename}`;
    } else {
      return res.status(400).json({ message: "Bus image is required" });
    }

    // 🔹 Save Bus to Database
    const newBus = await Bus.create({
      trip_id,
      bus_number,
      seating_capacity,
      driver_name,
      contact_number,
      Bus_image,
    });

    res.status(201).json({ message: "Bus added successfully", bus: newBus });
  } catch (error) {
    console.error("Error adding bus:", error);

    // Remove uploaded file if error occurs
    if (req.file) fs.unlinkSync(req.file.path);

    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// 🔹 Get Buses by Trip ID
export const getBusByTrip = async (req, res) => {
  try {
    const { trip_id } = req.params;
    const buses = await Bus.findAll({ where: { trip_id } });

    if (!buses || buses.length === 0) {
      return res.status(404).json({ message: "No buses found for this trip" });
    }

    res.status(200).json({ message: "Buses retrieved successfully", buses });
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// 🔹 Update Bus (Protected: Only Admins)
export const updateBus = async (req, res) => {
  try {
    const { bus_id } = req.params;
    const { trip_id, bus_number, seating_capacity, driver_name, contact_number } = req.body;

    const bus = await Bus.findByPk(bus_id);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    // Handle new image upload if provided
    let Bus_image = bus.Bus_image;
    if (req.file) {
      // Delete the old image before saving new one
      if (bus.Bus_image) {
        const oldImagePath = path.join(process.cwd(), bus.Bus_image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      Bus_image = `/uploads/buses/${req.file.filename}`;
    }

    await bus.update({ trip_id, bus_number, seating_capacity, driver_name, contact_number, Bus_image });

    res.status(200).json({ message: "Bus updated successfully", bus });
  } catch (error) {
    console.error("Error updating bus:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// 🔹 Delete Bus (Protected: Only Admins)
export const deleteBus = async (req, res) => {
  try {
    const { bus_id } = req.params;
    const bus = await Bus.findByPk(bus_id);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    // Remove the image file from the server
    if (bus.Bus_image) {
      const imagePath = path.join(process.cwd(), bus.Bus_image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await bus.destroy();
    res.status(200).json({ message: "Bus deleted successfully" });
  } catch (error) {
    console.error("Error deleting bus:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
