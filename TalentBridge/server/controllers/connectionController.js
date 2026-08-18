const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");
const Notification = require("../models/Notification");

// @route POST /api/connections/request/:userId
exports.sendRequest = async (req, res) => {
  try {
    const toUserId = req.params.userId;
    if (toUserId === req.userId) {
      return res.status(400).json({ message: "You cannot connect with yourself" });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) return res.status(404).json({ message: "User not found" });

    const alreadyConnected = toUser.connections.some((id) => id.toString() === req.userId);
    if (alreadyConnected) {
      return res.status(409).json({ message: "You are already connected with this user" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      from: req.userId,
      to: toUserId,
      status: "pending",
    });
    if (existingRequest) {
      return res.status(409).json({ message: "Connection request already sent" });
    }

    const request = await ConnectionRequest.create({ from: req.userId, to: toUserId });

    await Notification.create({
      userId: toUserId,
      fromUser: req.userId,
      type: "connection_request",
      message: "sent you a connection request",
      link: "/connections",
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: "Failed to send connection request", error: error.message });
  }
};

// @route PUT /api/connections/respond/:requestId
exports.respondToRequest = async (req, res) => {
  try {
    const { action } = req.body; // "accept" or "reject"
    const request = await ConnectionRequest.findById(req.params.requestId);

    if (!request) return res.status(404).json({ message: "Connection request not found" });
    if (request.to.toString() !== req.userId) {
      return res.status(403).json({ message: "You are not authorized to respond to this request" });
    }

    if (action === "accept") {
      request.status = "accepted";
      await request.save();

      await User.findByIdAndUpdate(request.from, { $addToSet: { connections: request.to } });
      await User.findByIdAndUpdate(request.to, { $addToSet: { connections: request.from } });

      await Notification.create({
        userId: request.from,
        fromUser: request.to,
        type: "connection_accepted",
        message: "accepted your connection request",
        link: "/connections",
      });
    } else {
      request.status = "rejected";
      await request.save();
    }

    res.status(200).json({ message: `Request ${action}ed successfully` });
  } catch (error) {
    res.status(500).json({ message: "Failed to respond to request", error: error.message });
  }
};

// @route GET /api/connections/pending
exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({ to: req.userId, status: "pending" }).populate(
      "from",
      "name profilePicture headline"
    );
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending requests", error: error.message });
  }
};

// @route GET /api/connections
exports.getConnections = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("connections", "name profilePicture headline");
    res.status(200).json(user.connections);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch connections", error: error.message });
  }
};

// @route DELETE /api/connections/:userId
exports.removeConnection = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { $pull: { connections: req.params.userId } });
    await User.findByIdAndUpdate(req.params.userId, { $pull: { connections: req.userId } });
    res.status(200).json({ message: "Connection removed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove connection", error: error.message });
  }
};
