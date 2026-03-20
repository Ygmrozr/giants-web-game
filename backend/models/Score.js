import mongoose from "mongoose"

const scoreSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 24,
      default: "guest",
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 10_000_000,
    },
  },
  { timestamps: true }
)

scoreSchema.index({ score: -1, createdAt: -1 })

export default mongoose.model("Score", scoreSchema)

