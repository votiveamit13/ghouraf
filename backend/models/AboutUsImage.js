import mongoose from "mongoose";

const aboutUsImagesSchema = new mongoose.Schema(
    {
        imagePath1: { type: String, required: true },
        imagePath2: { type: String, required: true },
        imagePath3: { type: String, required: true },
    },
    { timestamps: true }
);

export const AboutUsImage = mongoose.model("AboutUsImage", aboutUsImagesSchema);
