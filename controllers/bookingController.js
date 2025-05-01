import Booking from "../models/Booking.js";
import User from "../models/user.js";
import Trip from "../models/trip.js";

// ✅ Trip Book Karna (Create Booking)
export const bookTrip = async (req, res) => {
  try {
    const { user_id, trip_id } = req.body;

    if (!user_id || !trip_id) {
      return res.status(400).json({ error: "User ID and Trip ID are required" });
    }

    const newBooking = await Booking.create({ user_id, trip_id });

    res.status(201).json({ message: "Booking successful", booking: newBooking });
  } catch (error) {
    console.error("Error booking the trip:", error);
    res.status(500).json({ error: "Error booking the trip" });
  }
};

// ✅ Specific User Ki Bookings Fetch Karna (Get User Bookings)
export const getUserBookings = async (req, res) => {
  try {
    const user_id = parseInt(req.params.user_id); // ✅ Ensure it's an integer

    if (isNaN(user_id)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    const bookings = await Booking.findAll({
      where: { user_id },
      include: [
        {
          model: Trip,
          attributes: ["trip_id", "trip_name", "start_date", "end_date", "Trip_price", "Trip_image"],
        },
        {
          model: User,
          attributes: ["user_id", "username", "email"],
        },
      ],
    });

    console.log("Fetched Bookings:", bookings); // ✅ Debugging log

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Error fetching bookings" });
  }
};
