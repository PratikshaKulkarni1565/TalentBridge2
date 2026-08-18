const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, default: "" },
    salary: { type: String, default: "" },
    jobType: { type: String, enum: ["Full-time", "Part-time", "Internship", "Contract"], default: "Full-time" },
    skillsRequired: { type: [String], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
