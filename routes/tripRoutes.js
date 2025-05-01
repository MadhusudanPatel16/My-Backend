import express from "express";
import { authenticateAdmin } from "../middleware/authMiddleware.js";
import { createTrip, allTrip, tripById, updateTrip, deleteTrip, upload } from "../controllers/tripController.js";

const router = express.Router();

// Public Routes
router.get("/alltrips", allTrip);
router.get("/:id", tripById);

// Protected Routes (Only Admins)
router.post("/create",upload.single("Trip_image"), authenticateAdmin , createTrip);
router.put("/update/:id", upload.single("Trip_image"), authenticateAdmin, updateTrip);
router.delete("/delete/:id", authenticateAdmin, deleteTrip);

export default router;
