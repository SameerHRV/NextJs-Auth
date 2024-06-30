import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpires: {
      type: Date,
    },
    verificationToken: {
      type: String,
    },
    verificationExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.models.users || mongoose.model("users", userSchema);
