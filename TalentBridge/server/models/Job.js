const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, default: "" },
    workplaceType: { type: String, enum: ["Remote", "Hybrid", "On-site"], default: "On-site" },
    employmentType: { type: String, enum: ["Full-time", "Part-time", "Internship", "Contract"], default: "Full-time" },
    salaryMin: { type: String, default: "" },
    salaryMax: { type: String, default: "" },
    salary: { type: String, default: "" }, // Keep for backward compatibility
    jobType: { type: String, enum: ["Full-time", "Part-time", "Internship", "Contract"], default: "Full-time" }, // Keep for backward compatibility
    skillsRequired: { type: [String], default: [] },
    experienceLevel: { type: String, enum: ["Fresher", "0–1 years", "1–3 years", "3–5 years", "5+ years"], default: "Fresher" },
    education: { type: String, default: "" },
    applicationDeadline: { type: Date, default: null },
    status: { type: String, enum: ["Active", "Closed", "Draft"], default: "Active" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
