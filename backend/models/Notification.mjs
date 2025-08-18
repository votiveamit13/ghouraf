import mongoose from 'mongoose'
const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    type: { type: String, enum: ['MESSAGE', 'INTEREST', 'SYSTEM'] },
    data: {},
    read: { type: Boolean, default: false },
}, { timestamps: true })
export default mongoose.model('Notification', NotificationSchema)