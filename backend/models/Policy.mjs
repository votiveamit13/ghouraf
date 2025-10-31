import mongoose from "mongoose";

const policySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Privacy", "Terms", "Safety", "Advice"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

policySchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});

const Policy = mongoose.model("Policy", policySchema);
export default Policy;
