const express = require("express");
const router = express.Router();
const {
  sendRequest,
  respondToRequest,
  getPendingRequests,
  getConnections,
  removeConnection,
} = require("../controllers/connectionController");
const protect = require("../middleware/auth");

router.post("/request/:userId", protect, sendRequest);
router.put("/respond/:requestId", protect, respondToRequest);
router.get("/pending", protect, getPendingRequests);
router.get("/", protect, getConnections);
router.delete("/:userId", protect, removeConnection);

module.exports = router;
