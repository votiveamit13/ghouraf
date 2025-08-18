import mongoose from 'mongoose'
const TeamSchema = new mongoose.Schema({
    name: String,
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    preferences: {
        location: { city: String, state: String },
        budgetPerPerson: Number,
        lifestyle: [String],
    },
    savedPostIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
}, { timestamps: true })
export default mongoose.model('Team', TeamSchema)