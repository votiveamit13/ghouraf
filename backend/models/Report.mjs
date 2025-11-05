import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "postType",
    },
    postType: {
        type: String,
        required: true,
        enum: ["Space", "SpaceWanted", "TeamUp"],
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    reason: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Report', reportSchema)