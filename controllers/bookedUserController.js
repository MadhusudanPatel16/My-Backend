import UserTrip from "../models/userTrip.js";
import Trip from "../models/trip.js";
import Bus from "../models/bus.js";
import Hotel from "../models/hotel.js";
import PickupPoint from "../models/pickupPoint.js";
import User from "../models/user.js";

// Book a trip and store all relevant details
export const bookTrip = async (req, res) => {
  try {
    const { user_id, trip_id, bus_id, hotel_id, pickup_point_id } = req.body;

    const booking = await UserTrip.create({
      user_id,
      trip_id,
      bus_id,
      hotel_id,
      pickup_point_id,
    });

    return res.status(201).json({ message: "Trip booked successfully", booking });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ error: "Failed to book trip" });
  }
};

// Fetch full booking details
export const getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await UserTrip.findOne({
      where: { booking_id: id },
      include: [
        { model: User, attributes: ["user_id", "name", "email"] },
        { model: Trip },
        { model: Bus },
        { model: Hotel },
        { model: PickupPoint },
      ],
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json({ booking });
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ error: "Failed to fetch booking details" });
  }
};
