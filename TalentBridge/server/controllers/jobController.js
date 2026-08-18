const Job = require("../models/Job");
const Notification = require("../models/Notification");

// @route POST /api/jobs
exports.createJob = async (req, res) => {
  try {
    const { company, title, description, location, salary, jobType, skillsRequired } = req.body;
    if (!company || !title || !description) {
      return res.status(400).json({ message: "Company, title and description are required" });
    }

    const job = await Job.create({
      company,
      title,
      description,
      location,
      salary,
      jobType,
      skillsRequired,
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
    const { search, location, jobType } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }
    if (location) query.location = { $regex: location, $options: "i" };
    if (jobType) query.jobType = jobType;

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

// @route PUT /api/jobs/:id/apply
exports.applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const alreadyApplied = job.applicants.some((id) => id.toString() === req.userId);
    if (alreadyApplied) {
      return res.status(409).json({ message: "You have already applied to this job" });
    }

    job.applicants.push(req.userId);
    await job.save();

    await Notification.create({
      userId: job.createdBy,
      fromUser: req.userId,
      type: "job_application",
      message: `applied to your job posting: ${job.title}`,
      link: `/jobs/${job._id}`,
    });

    res.status(200).json({ message: "Application submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to apply to job", error: error.message });
  }
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
