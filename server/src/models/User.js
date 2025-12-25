import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String,     required: function() {
      // Only require password if the user does NOT have a googleId or githubId
      return !this.googleId && !this.githubId;
    } },
      googleId: {
    type: String,
    unique: true,
    sparse: true // Important: allows multiple users to have null googleId
  },
  githubId: {
    type: String,
    unique: true,
    sparse: true
  },
  provider: {
    type: String,
    default: "email"
  },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
