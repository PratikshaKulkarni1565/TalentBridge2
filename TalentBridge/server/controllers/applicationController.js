const Application = require("../models/Application");
const Job = require("../models/Job");
const Notification = require("../models/Notification");

// @route POST /api/applications
exports.createApplication = async (req, res) => {
  try {
    const { jobId, resume, coverLetter, skills, experience, portfolio, linkedIn } = req.body;
    
    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Prevent self-application
    if (job.createdBy.toString() === req.userId) {
      return res.status(403).json({ message: "You cannot apply to a job that you posted" });
    }

    // Check if already applied (handled by unique index, but also check here for better error message)
    const existingApplication = await Application.findOne({ jobId, applicantId: req.userId });
    if (existingApplication) {
      return res.status(409).json({ message: "You have already applied to this job" });
    }

    const application = await Application.create({
      jobId,
      applicantId: req.userId,
      employerId: job.createdBy,
      resume: resume || "",
      coverLetter: coverLetter || "",
      skills: skills || [],
      experience: experience || "",
      portfolio: portfolio || "",
      linkedIn: linkedIn || "",
      status: "Applied",
    });

    // Notify employer about new application
    await Notification.create({
      userId: job.createdBy,
      fromUser: req.userId,
      type: "job_application",
      message: `applied to your job posting: ${job.title}`,
      link: `/applications/${application._id}`,
    });

    // Notify applicant about successful application
    await Notification.create({
      userId: req.userId,
      fromUser: job.createdBy,
      type: "application_status",
      message: `Your application for ${job.title} has been submitted`,
      link: `/my-applications`,
    });

    res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "You have already applied to this job" });
    }
    res.status(500).json({ message: "Failed to submit application", error: error.message });
  }
};

// @route GET /api/applications/my-applications
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicantId: req.userId })
      .populate("jobId", "title company location salary jobType")
      .populate("employerId", "name profilePicture company")
      .sort({ createdAt: -1 });
    
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications", error: error.message });
  }
};

// @route GET /api/applications/job/:jobId
exports.getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Only employer who posted the job can view applicants
    if (job.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only view applicants for your own jobs" });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate("applicantId", "name email profilePicture skills location headline")
      .sort({ createdAt: -1 });
    
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch job applications", error: error.message });
  }
};

// @route PUT /api/applications/:id/status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!["Applied", "Shortlisted", "Interview", "Rejected", "Hired"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const job = await Job.findById(application.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Only employer who posted the job can update application status
    if (job.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only update applications for your own jobs" });
    }

    application.status = status;
    await application.save();

    // Notify applicant about status change
    await Notification.create({
      userId: application.applicantId,
      fromUser: req.userId,
      type: "application_status",
      message: `Your application for ${job.title} has been ${status.toLowerCase()}`,
      link: `/my-applications`,
    });

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: "Failed to update application status", error: error.message });
  }
};

// @route GET /api/applications/:id
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("jobId")
      .populate("applicantId", "name email profilePicture skills location headline experience education")
      .populate("employerId", "name profilePicture");
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Only applicant or employer can view the application
    if (application.applicantId._id.toString() !== req.userId && 
        application.employerId.toString() !== req.userId) {
      return res.status(403).json({ message: "You don't have permission to view this application" });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch application", error: error.message });
  }
};

// @route DELETE /api/applications/:id
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Only applicant can delete their own application
    if (application.applicantId.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only delete your own applications" });
    }

    await application.deleteOne();
    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete application", error: error.message });
  }
};
