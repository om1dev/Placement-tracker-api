const Job = require("../models/Job");

// Create Job (Recruiter only)
exports.createJob = async (req, res) => {
  try {
    const { title, company, package, requiredSkills, deadline } = req.body;

    const job = await Job.create({
      title,
      company,
      package,
      requiredSkills,
      deadline,
      recruiter: req.user._id,
    });

    res.status(201).json(job);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("recruiter", "email role");
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};