const express = require("express");
const router = express.Router();
const { sendMessage, getConversation, getConversationsList } = require("../controllers/messageController");
const protect = require("../middleware/auth");

router.get("/", protect, getConversationsList);
router.post("/:receiverId", protect, sendMessage);
router.get("/:otherUserId", protect, getConversation);

module.exports = router;
