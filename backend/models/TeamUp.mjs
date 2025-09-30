import mongoose from 'mongoose'
import budgetType from '../constants/budget.type.mjs'
import roomAvailableForType from '../constants/roomAvailableFor.type.mjs';

const TeamUpSchema = new mongoose.Schema({
    title: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    budget: { type: String, required: true },
    budgetType: { type: String, enum: budgetType, required: true },
    moveInDate: { type: Date },
    period: { type: String },
    amenities: [{ type: String, required: true }],
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: roomAvailableForType, required: true },
    minAge: { type: Number },
    maxAge: { type: Number },
    occupationPreference: { type: String },
    occupation: { type: String },
    smoke: { type: Boolean, required: true },
    pets: { type: Boolean, required: true },
    petsPreference: { type: Boolean, required: true },
    language: { type: String },
    languagePreference: { type: String },
    roommatePref: { type: String, enum: roomAvailableForType, required: true },
    description: { type: String, required: true },
    buddyDescription: { type: String },
    photos: [{ id: String, url: String }],
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    available: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
}, { timestamps: true }
);

export default mongoose.model("TeamUp", SpaceSchema);