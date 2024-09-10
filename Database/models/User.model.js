const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isLoggedIn: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["User", "Admin","SuperAdmin"],
      default: "User",
    }
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
