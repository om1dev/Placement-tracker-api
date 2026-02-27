const Interview = require("../models/Interview");
const Application = require("../models/Application");

// Recruiter schedule interview
exports.scheduleInterview = async (req, res) => {
  try {
    const { applicationId, date, time } = req.body;

    const application = await Application.findById(applicationId)
      .populate("job");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Only recruiter who owns the job can schedule
    if (application.job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Only shortlisted or selected candidates
    if (!["Shortlisted", "Selected"].includes(application.status)) {
      return res.status(400).json({
        message: "Interview allowed only for shortlisted/selected students"
      });
    }

    const interview = await Interview.create({
      application: applicationId,
      recruiter: req.user._id,
      student: application.student,
      date,
      time
    });

    res.status(201).json(interview);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student view own interviews
exports.getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      student: req.user._id
    }).populate("application");

    res.json(interviews);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Recruiter view interviews for their jobs
exports.getRecruiterInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      recruiter: req.user._id
    }).populate("application");

    res.json(interviews);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};