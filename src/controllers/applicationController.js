const Application = require("../models/Application");
const Job = require("../models/Job");

// Student apply to job
exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Prevent duplicate applications
    const existing = await Application.findOne({
      student: req.user._id,
      job: jobId,
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied" });
    }

    const application = await Application.create({
      student: req.user._id,
      job: jobId,
    });

    res.status(201).json(application);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student applications
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      student: req.user._id,
    }).populate("job");

    res.json(applications);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Recruiter update status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const application = await Application.findById(applicationId)
      .populate("job");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Only job owner can update
    if (application.job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    application.status = status;
    await application.save();

    res.json(application);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Recruiter get applications for specific job
exports.getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ job: jobId })
      .populate("student", "email")
      .populate("job");

    res.json(applications);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};