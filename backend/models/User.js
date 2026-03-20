const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default: "/images/avatars/default.png"
    },
    title: {
      type: String,
      default: "Acemi Asker"
    },
    maxScore: {
      type: Number,
      default: 0
    },
    totalGames: {
      type: Number,
      default: 0
    },
    totalKills: {
      type: Number,
      default: 0
    },
    totalItems: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);