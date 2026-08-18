const express = require("express");
const router = express.Router();
const { createJob, getJobs, getJobById, applyToJob, deleteJob } = require("../controllers/jobController");
const protect = require("../middleware/auth");

router.post("/", protect, createJob);
router.get("/", protect, getJobs);
router.get("/:id", protect, getJobById);
router.put("/:id/apply", protect, applyToJob);
router.delete("/:id", protect, deleteJob);

module.exports = router;
