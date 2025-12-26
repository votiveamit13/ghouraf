import mongoose from 'mongoose'
import budgetType from '../constants/budget.type.mjs'
import roomAvailableForType from '../constants/roomAvailableFor.type.mjs';

const PromotionSchema = new mongoose.Schema(
  {
    isPromoted: { type: Boolean, default: false },
    plan: { type: String, enum: ["10_days", "30_days"], default: null },
    amountUSD: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
    paymentId: { type: String, default: null },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    promotionCount: { type: Number, default: 0 },
    promotionType: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { _id: false }
);

const TeamUpSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  postCategory: { type: String, default: "Teamup" },
  title: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  // zip: { type: String, required: true },
  budget: { type: Number, required: true },
  budgetType: { type: String, enum: budgetType, required: true },
  // moveInDate: { type: Date },
  period: { type: String },
  amenities: {
  type: [String],
  default: [],
  required: true
},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number },
  gender: { type: String, enum: roomAvailableForType, required: true },
  minAge: { type: Number },
  maxAge: { type: Number },
  occupationPreference: { type: String },
  occupation: { type: String },
  smoke: { type: Boolean },
  pets: { type: Boolean, required: true },
  petsPreference: { type: Boolean },
  // language: { type: String },
  // languagePreference: { type: String },
  // roommatePref: { type: String, enum: roomAvailableForType, required: true },
  description: { type: String, required: true },
  buddyDescription: { type: String },
  photos: [{ id: String, url: String }],
  status: { type: String, enum: ["active", "inactive"], default: "inactive" },
  available: { type: Boolean, default: true },
  is_deleted: { type: Boolean, default: false },
  reportsCount: { type: Number, default: 0 },
  promotion: { type: PromotionSchema, default: {} },
}, { timestamps: true }
);

export default mongoose.model("TeamUp", TeamUpSchema);