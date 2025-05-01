import express from "express";
import { registerAdmin, loginAdmin, profileAdmin } from "../controllers/adminController.js";
import {authenticateAdmin} from "../middleware/authMiddleware.js"; 

const router = express.Router();


router.post("/register", registerAdmin);

router.post("/login", loginAdmin);


router.get("/profile", authenticateAdmin, profileAdmin);

export default router;
