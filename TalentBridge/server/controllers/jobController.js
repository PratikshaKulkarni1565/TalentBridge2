const Job = require("../models/Job");
const Notification = require("../models/Notification");
const User = require("../models/User");

// @route POST /api/jobs
exports.createJob = async (req, res) => {
  try {
    const { 
      company, title, description, location, salary, jobType, skillsRequired,
      workplaceType, employmentType, salaryMin, salaryMax, experienceLevel, education, applicationDeadline 
    } = req.body;
    if (!company || !title || !description) {
      return res.status(400).json({ message: "Company, title and description are required" });
    }

    // Check if user is employer or admin
    const user = await User.findById(req.userId);
    if (!user || (user.role !== "employer" && user.role !== "admin")) {
      return res.status(403).json({ message: "Only employers can post jobs" });
    }

    const job = await Job.create({
      company,
      title,
      description,
      location,
      salary,
      jobType,
      skillsRequired,
      workplaceType,
      employmentType,
      salaryMin,
      salaryMax,
      experienceLevel,
      education,
      applicationDeadline,
      createdBy: req.userId,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Failed to create job", error: error.message });
  }
};

// @route GET /api/jobs
exports.getJobs = async (req, res) => {
  try {
    const { 
      search, location, jobType, employmentType, workplaceType, experienceLevel, skills 
    } = req.query;
    const query = { status: "Active" }; // Only show active jobs by default

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (location) query.location = { $regex: location, $options: "i" };
    if (jobType) query.jobType = jobType;
    if (employmentType) query.employmentType = employmentType;
    if (workplaceType) query.workplaceType = workplaceType;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (skills) {
      const skillArray = skills.split(",").map(s => s.trim());
      query.skillsRequired = { $in: skillArray };
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 }).populate("createdBy", "name profilePicture");
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch jobs", error: error.message });
  }
};

// @route GET /api/jobs/:id
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("createdBy", "name profilePicture");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch job", error: error.message });
  }
};

// @route PUT /api/jobs/:id/apply (deprecated - use /api/applications instead)
exports.applyToJob = async (req, res) => {
  return res.status(410).json({ message: "This endpoint is deprecated. Use POST /api/applications instead" });
};

// @route DELETE /api/jobs/:id
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only delete jobs you posted" });
    }
    await job.deleteOne();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete job", error: error.message });
  }
};
