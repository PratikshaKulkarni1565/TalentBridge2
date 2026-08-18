const Message = require("../models/Message");
const Notification = require("../models/Notification");

// @route POST /api/messages/:receiverId
exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "Message text is required" });

    const newMessage = await Message.create({
      sender: req.userId,
      receiver: req.params.receiverId,
      message,
    });

    await Notification.create({
      userId: req.params.receiverId,
      fromUser: req.userId,
      type: "message",
      message: "sent you a message",
      link: `/messages/${req.userId}`,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message", error: error.message });
  }
};

// @route GET /api/messages/:otherUserId
exports.getConversation = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.userId, receiver: req.params.otherUserId },
        { sender: req.params.otherUserId, receiver: req.userId },
      ],
    }).sort({ createdAt: 1 });

    await Message.updateMany(
      { sender: req.params.otherUserId, receiver: req.userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch conversation", error: error.message });
  }
};

// @route GET /api/messages
// Returns the most recent message with each conversation partner (an inbox list)
exports.getConversationsList = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const userId = new mongoose.Types.ObjectId(req.userId);

    const conversations = await Message.aggregate([
      { $match: { $or: [{ sender: userId }, { receiver: userId }] } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$sender", userId] }, "$receiver", "$sender"],
          },
          lastMessage: { $first: "$message" },
          createdAt: { $first: "$createdAt" },
          isRead: { $first: "$isRead" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          "user.name": 1,
          "user.profilePicture": 1,
          lastMessage: 1,
          createdAt: 1,
          isRead: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch conversations", error: error.message });
  }
};
