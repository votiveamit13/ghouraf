import mongoose from 'mongoose'
const InterestSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
  postType: { type: String, enum: ['OFFERING'], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  note: String,
}, { timestamps: true })
InterestSchema.index({ postId: 1, userId: 1 }, { unique: true })
export default mongoose.model('Interest', InterestSchema)