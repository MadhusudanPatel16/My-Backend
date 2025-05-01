import express from "express";
import { pickupPointCreate, PickupPointByTrip, pickPointDelete,updatePickupPoint } from "../controllers/pickupPointController.js";
import {authenticateAdmin} from "../middleware/authMiddleware.js"; // Import JWT Middleware

const router = express.Router();

router.get("/:trip_id", PickupPointByTrip); // Public: Get Pickup Points by Trip

router.post("/create", authenticateAdmin, pickupPointCreate); // Protected: Add Pickup Point (Admin only)

router.delete("/:pickup_id", authenticateAdmin, pickPointDelete); // Protected: Delete Pickup Point (Admin only)
router.put("/update/:pickup_id",authenticateAdmin,updatePickupPoint);

export default router;
