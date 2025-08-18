import mongoose from 'mongoose'
const ConversationSchema = new mongoose.Schema({
    type: { type: String, enum: ['DIRECT', 'TEAM', 'GROUP_TO_POST'], required: true },
    participantIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }],
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    lastMessageAt: { type: Date, default: Date.now },
}, { timestamps: true })
ConversationSchema.index({ participantIds: 1 })
export default mongoose.model('Conversation', ConversationSchema)