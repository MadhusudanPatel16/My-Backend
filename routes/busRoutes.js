import express from "express";
import { getBusByTrip, addBus, deleteBus, updateBus } from "../controllers/busController.js";
import { authenticateAdmin } from "../middleware/authMiddleware.js"; // Import JWT middleware
import { upload } from "../middleware/multer.js"; // ✅ Correct import

const router = express.Router();

router.get("/:trip_id", getBusByTrip); // Public: Get buses for a trip
router.post("/addbus", upload.single("Bus_image"), authenticateAdmin, addBus); // ✅ Correct middleware order
router.delete("/:bus_id", authenticateAdmin, deleteBus);
router.put("/update/bus_id",authenticateAdmin,updateBus); // Protected: Delete a bus (Admin only)

export default router;
