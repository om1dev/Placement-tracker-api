const Test = require("../models/Test");
const Application = require("../models/Application");

// Recruiter create test
exports.createTest = async (req, res) => {
  try {
    const { jobId, title, questions } = req.body;

    const test = await Test.create({
      job: jobId,
      recruiter: req.user._id,
      title,
      questions,
    });

    res.status(201).json(test);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student attempt test
exports.attemptTest = async (req, res) => {
  try {
    const { testId, answers } = req.body;

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    let score = 0;

    test.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score++;
      }
    });

    const percentage = (score / test.questions.length) * 100;

    // Update application score
    const application = await Application.findOne({
      student: req.user._id,
      job: test.job,
    });

    if (application) {
      application.score = percentage;
      await application.save();
    }

    res.json({
      totalQuestions: test.questions.length,
      correctAnswers: score,
      percentage,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Recruiter view results
exports.getTestResults = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ job: jobId })
      .populate("student", "email")
      .select("student score status");

    res.json(applications);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};