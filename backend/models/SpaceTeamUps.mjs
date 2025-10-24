import mongoose from "mongoose";

const SpaceTeamUpsSchema = new mongoose.Schema(
    {
        postId: { type: mongoose.Schema.Types.ObjectId, ref: "Space" },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        interested: { type: boolean },
    },
    { timestamps: true }
);

export default mongoose.model("SpaceTeamUps", SpaceTeamUpsSchema);