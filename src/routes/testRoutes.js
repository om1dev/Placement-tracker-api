const express = require("express");
const router = express.Router();

const {
  createTest,
  attemptTest,
  getTestResults,
} = require("../controllers/testController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Recruiter creates test
router.post("/", protect, authorize("recruiter"), createTest);

// Student attempts test
router.post("/attempt", protect, authorize("student"), attemptTest);

// Recruiter views results for job
router.get(
  "/results/:jobId",
  protect,
  authorize("recruiter"),
  getTestResults
);

module.exports = router;