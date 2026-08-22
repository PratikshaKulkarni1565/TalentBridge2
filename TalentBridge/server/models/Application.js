const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resume: { type: String, default: "" },
    coverLetter: { type: String, default: "" },
    skills: { type: [String], default: [] },
    experience: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    linkedIn: { type: String, default: "" },
    status: { 
      type: String, 
      enum: ["Applied", "Shortlisted", "Interview", "Rejected", "Hired"],
      default: "Applied" 
    },
  },
  { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
