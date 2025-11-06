import mongoose from "mongoose";
import propertyType from "../constants/property.type.mjs";
import budgetType from "../constants/budget.type.mjs";
import roomAvailableForType from "../constants/roomAvailableFor.type.mjs";
import bedroomsType from "../constants/bedrooms.type.mjs";

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

const SpaceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    postCategory: { type: String, default: "Space" },
    title: { type: String, required: true, trim: true },
    propertyType: { type: String, enum: propertyType, required: true },
    budget: { type: Number, required: true },
    budgetType: { type: String, enum: budgetType, required: true },
    personalInfo: { type: String, enum: ["Landlord", "Agent", "Flatmate"], required: true },
    size: { type: Number, required: true },
    furnishing: { type: Boolean, required: true },
    smoking: { type: Boolean },
    roomsAvailableFor: { type: String, enum: roomAvailableForType, required: true },
    bedrooms: { type: Number, enum: bedroomsType, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    location: String,
    description: { type: String, required: true },
    amenities: { type: [String], required: true },
    featuredImage: { type: String, required: true },
    photos: [{ id: String, url: String }],
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    available: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
    reportsCount: { type: Number, default: 0 },
    teamUpsCount: { type: Number, default: 0 },
    promotion: { type: PromotionSchema, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("Space", SpaceSchema);