import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

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
    
    notes: [noteSchema],

  },
  {
    timestamps: true,
  }
);

const FreeTrial =
  mongoose.models.FreeTrial ||
  mongoose.model("FreeTrial", freeTrialSchema);

export default FreeTrial;