const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Interview = require("../models/Interview");

// Get overall system statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalRecruiters = await User.countDocuments({ role: "recruiter" });
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const totalInterviews = await Interview.countDocuments();
    const selectedCount = await Application.countDocuments({
      status: "Selected",
    });

    const placementRate =
      totalApplications > 0
        ? ((selectedCount / totalApplications) * 100).toFixed(2)
        : 0;

    res.json({
      totalStudents,
      totalRecruiters,
      totalJobs,
      totalApplications,
      totalInterviews,
      selectedCount,
      placementRate,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};