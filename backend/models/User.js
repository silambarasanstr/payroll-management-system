import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "hr", "employee"],
      default: "employee",
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    isActive: { type: Boolean, default: true },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
