import express from "express";
import { register, login, getProfile } from "../controllers/authController.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", apiLimiter, login);
router.get("/profile", getProfile); 

export default router;
