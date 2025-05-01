import express from "express";
import { bookTrip, getUserBookings } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/book", bookTrip); // Trip book karne ka route
router.get("/:user_id", getUserBookings); // User bookings fetch karne ka route

export default router;
