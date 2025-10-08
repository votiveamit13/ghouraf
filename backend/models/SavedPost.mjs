import mongoose from "mongoose";

const savedPostSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    postCategory: { type: String, enum: ["Space", "TeamUp", "SpaceWanted"], required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, required: true },
    snapshot: { type: Object },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("SavedPost", savedPostSchema);
