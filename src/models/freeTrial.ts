import mongoose from "mongoose";

const freeTrialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["new", "contacted", "interested", "trial-booked", "joined"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

const FreeTrial =
  mongoose.models.FreeTrial ||
  mongoose.model("FreeTrial", freeTrialSchema);

export default FreeTrial;