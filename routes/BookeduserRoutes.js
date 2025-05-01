import express from "express";
import { bookTrip, getBookingDetails } from "../controllers/bookedUserController.js";

const router = express.Router();

// Route for booking a trip
router.post("/book-trip", bookTrip);

// Route for fetching booking details
router.get("/booking-details/:id", getBookingDetails);

export default router;
