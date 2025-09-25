import express from "express";
import { addHotel, getHotelByTrip, deleteHotel,updateHotel } from "../controllers/hotelController.js";
import {authenticateAdmin} from "../middleware/authMiddleware.js"; // Import JWT middleware
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.get("/:trip_id", getHotelByTrip); // Public: Get hotels for a trip
router.post("/addhotel",authenticateAdmin,upload.single("Hotel_image"), addHotel); // Protected: Add a hotel (Admin only)
router.delete("/:hotel_id", authenticateAdmin, deleteHotel); // Protected: Delete a hotel (Admin only)
router.put("/update/hotel_id",authenticateAdmin,updateHotel);
export default router;
