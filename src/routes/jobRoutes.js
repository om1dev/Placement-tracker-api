const express = require("express");
const router = express.Router();
const { createJob, getJobs } = require("../controllers/jobController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("recruiter"), createJob);
router.get("/", protect, getJobs);

module.exports = router;