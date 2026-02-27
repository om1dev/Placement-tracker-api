const express = require("express");
const router = express.Router();
const {
  applyToJob,
  getMyApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const { protect, authorize } = require("../middleware/authMiddleware");
const { getApplicationsByJob } = require("../controllers/applicationController");

// Student apply to job
router.post("/", protect, authorize("student"), applyToJob);

// Student view own applications
router.get("/me", protect, authorize("student"), getMyApplications);

// Recruiter update application status
router.put(
  "/:applicationId",
  protect,
  authorize("recruiter"),
  updateApplicationStatus
);

router.get(
  "/job/:jobId",
  protect,
  authorize("recruiter"),
  getApplicationsByJob
);

module.exports = router;