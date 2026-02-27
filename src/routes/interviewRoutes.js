const express = require("express");
const router = express.Router();

const {
  scheduleInterview,
  getMyInterviews,
  getRecruiterInterviews,
} = require("../controllers/interviewController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Recruiter schedules interview
router.post("/", protect, authorize("recruiter"), scheduleInterview);

// Student views own interviews
router.get("/me", protect, authorize("student"), getMyInterviews);

// Recruiter views scheduled interviews
router.get("/recruiter", protect, authorize("recruiter"), getRecruiterInterviews);

module.exports = router;