const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    location: String,
    startDate: Date,
    endDate: Date,
    currentlyWorking: { type: Boolean, default: false },
    description: String,
  },
  { _id: true }
);

const educationSchema = new mongoose.Schema(
  {
    school: String,
    degree: String,
    fieldOfStudy: String,
    startYear: Number,
    endYear: Number,
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    profilePicture: { type: String, default: "" },
    coverPicture: { type: String, default: "" },
    headline: { type: String, default: "" },
    about: { type: String, default: "" },
    location: { type: String, default: "" },
    skills: { type: [String], default: [] },
    education: { type: [educationSchema], default: [] },
    experience: { type: [experienceSchema], default: [] },
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    role: { type: String, enum: ["user", "recruiter", "admin"], default: "user" },
  },
  { timestamps: true }
);

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
