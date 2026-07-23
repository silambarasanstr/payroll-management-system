import express from "express";
import {
  checkIn,
  checkOut,
  markAttendance,
  getAttendance,
  getMonthlySummary,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/check-in", checkIn);
router.post("/check-out", checkOut);
router.post("/mark", markAttendance);
router.get("/:employeeId/summary", getMonthlySummary);
router.get('/:employeeId', getAttendance);


export default router;
