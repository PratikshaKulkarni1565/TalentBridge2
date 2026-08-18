const User = require("../models/User");
const Job = require("../models/Job");

// @route GET /api/search?q=&type=users|jobs|all
exports.search = async (req, res) => {
  try {
    const { q, type } = req.query;
    if (!q) return res.status(400).json({ message: "Search query is required" });

    const result = {};

    if (!type || type === "all" || type === "users") {
      result.users = await User.find({
        $or: [
          { name: { $regex: q, $options: "i" } },
          { skills: { $regex: q, $options: "i" } },
          { headline: { $regex: q, $options: "i" } },
        ],
      })
        .select("name profilePicture headline")
        .limit(20);
    }

    if (!type || type === "all" || type === "jobs") {
      result.jobs = await Job.find({
        $or: [
          { title: { $regex: q, $options: "i" } },
          { company: { $regex: q, $options: "i" } },
          { skillsRequired: { $regex: q, $options: "i" } },
        ],
      }).limit(20);
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message });
  }
};
