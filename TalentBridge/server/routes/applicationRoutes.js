const express = require("express");
const router = express.Router();
const { 
  createApplication, 
  getMyApplications, 
  getJobApplications, 
  updateApplicationStatus, 
  getApplicationById,
  deleteApplication 
} = require("../controllers/applicationController");
const protect = require("../middleware/auth");

router.post("/", protect, createApplication);
router.get("/my-applications", protect, getMyApplications);
router.get("/job/:jobId", protect, getJobApplications);
router.get("/:id", protect, getApplicationById);
router.put("/:id/status", protect, updateApplicationStatus);
router.delete("/:id", protect, deleteApplication);

module.exports = router;
