import mongoose from "mongoose";

const heroImageSchema = new mongoose.Schema(
  {
    imagePath: { type: String, required: true },
  },
  { timestamps: true }
);

export const HeroImage = mongoose.model("HeroImage", heroImageSchema);
