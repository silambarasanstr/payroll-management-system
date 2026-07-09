import express from "express";

import {
  applyLeave,
  getLeaves,
  updateLeaveStatus,
} from "../controllers/leaveController.js";

const router = express.Router();

router.post("/apply", applyLeave);
router.get("/employee/:employeeId", getLeaves);
router.put("/status/:id", updateLeaveStatus);

export default router;
