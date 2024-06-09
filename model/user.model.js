import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    tc: {
      type: Boolean,
      required: true,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
