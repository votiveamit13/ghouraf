import mongoose from "mongoose";

const PromotionOptionSchema = new mongoose.Schema({
  plan: { type: Number, required: true },
  amountUSD: { type: Number, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
}, { timestamps: true });

export default mongoose.model("PromotionOption", PromotionOptionSchema);
