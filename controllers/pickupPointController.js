import PickupPoint from "../models/pickupPoint.js";
import Trip from "../models/trip.js";
import {authenticateAdmin} from "../middleware/authMiddleware.js"; // Import JWT Middleware

// 🔹 Create a Pickup Point (Protected: Only Admins)
export const pickupPointCreate = async (req, res) => {
  try {
    authenticateAdmin(req, res, async () => {
      const { trip_id, location, time } = req.body;

      // Check if the trip exists
      const trip = await Trip.findByPk(trip_id);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      // Create a new pickup point
      const newPickupPoint = await PickupPoint.create({
        trip_id,
        location,
        time,
      });

      res.status(201).json({
        message: "Pickup point added successfully",
        pickupPoint: newPickupPoint,
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// 🔹 Get Pickup Points by Trip ID (Public Route)
export const PickupPointByTrip = async (req, res) => {
  try {
    const { trip_id } = req.params;

    // Fetch pickup points for the given trip ID
    const pickupPoints = await PickupPoint.findAll({
      where: { trip_id },
    });

    if (!pickupPoints.length) {
      return res.status(404).json({ message: "No pickup points found for this trip" });
    }

    res.status(200).json({ message: "Pickup points retrieved successfully", pickupPoints });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// 🔹 Delete a Pickup Point (Protected: Only Admins)
export const pickPointDelete = async (req, res) => {
  try {
    authenticateAdmin(req, res, async () => {
      const { pickup_id } = req.params;

      // Check if the pickup point exists
      const pickupPoint = await PickupPoint.findByPk(pickup_id);
      if (!pickupPoint) {
        return res.status(404).json({ message: "Pickup point not found" });
      }

      // Delete the pickup point
      await pickupPoint.destroy();

      res.status(200).json({ message: "Pickup point deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
// 🔹 Update a Pickup Point (Protected: Only Admins)
export const updatePickupPoint = async (req, res) => {
  try {
    authenticateAdmin(req, res, async () => {
      const { pickup_id } = req.params;
      const { trip_id, location, time } = req.body;

      // Ensure trip_id is provided
      if (!trip_id) {
        return res.status(400).json({ message: "Trip ID is required for updating a pickup point" });
      }

      // Find the pickup point by ID
      const pickupPoint = await PickupPoint.findByPk(pickup_id);
      if (!pickupPoint) {
        return res.status(404).json({ message: "Pickup point not found" });
      }

      // Check if the trip exists
      const trip = await Trip.findByPk(trip_id);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      // Update pickup point details
      await pickupPoint.update({ trip_id, location, time });

      res.status(200).json({ message: "Pickup point updated successfully", pickupPoint });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
