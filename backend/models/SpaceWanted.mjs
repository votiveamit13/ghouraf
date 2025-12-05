import mongoose from "mongoose";
import budgetType from "../constants/budget.type.mjs";
import roomAvailableForType from "../constants/roomAvailableFor.type.mjs";

const PromotionSchema = new mongoose.Schema(
  {
    isPromoted: { type: Boolean, default: false },
    plan: { type: String, enum: ["10_days", "30_days"], default: null },
    amountUSD: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
    paymentId: { type: String, default: null },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },

    promotionType: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { _id: false }
);

const SpaceWantedSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    propertyType: { type: String, required: true },
    roomSize: { type: Number, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    // zip: { type: String, required: true },
    budget: { type: Number, required: true },
    budgetType: { type: String, enum: budgetType, required: true },
    moveInDate: { type: String },
    period: { type: String, required: true },
    amenities: [{ type: String }],
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    occupation: { type: String, enum: ["Student", "Professional"], required: true },
    smoke: { type: String, enum: ["Yes", "No", "Sometimes"] },
    pets: { type: String, enum: ["Yes", "No"] },
    // language: { type: String },
    // roommatePref: { type: String, enum: roomAvailableForType, required: true },
    title: { type: String, required: true, required: true },
    description: { type: String, required: true },
    photos: [{ id: String, url: String }],
    teamUp: { type: Boolean, default: false },
    reportsCount: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    available: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
    postCategory: { type: String, default: "Spacewanted" },
    promotion: { type: PromotionSchema, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("SpaceWanted", SpaceWantedSchema);
