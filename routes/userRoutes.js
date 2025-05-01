import express from "express";
import { registerUser, loginUser, profileUser } from "../controllers/userController.js";
import {authenticateUser} from "../middleware/authMiddleware.js"; 

const router = express.Router();

router.post("/register", registerUser);
 
router.post("/login", loginUser);
 
router.get("/profile", authenticateUser, profileUser); 

export default router;
