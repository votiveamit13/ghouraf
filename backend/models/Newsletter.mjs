import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, "Email is invalid"],
  },
  agreedToTerms: {
    type: Boolean,
    required: [true, "You must agree to the terms & conditions"],
    validate: {
      validator: (value) => value === true,
      message: "You must agree to the terms & conditions",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Newsletter || mongoose.model("Newsletter", newsletterSchema);
