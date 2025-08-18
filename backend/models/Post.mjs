import mongoose from 'mongoose'
import POST_TYPES from "../constants/post.type.mjs"
import roomType from '../constants/room.type.mjs'
import leaseType from '../constants/lease.type.mjs'
import furnishedType from '../constants/furnished.type.mjs'
import durationType from '../constants/duration.type.mjs'



const AddressSchema = new mongoose.Schema({
    line1: String,
    area: String,
    city: { type: String, index: true },
    state: String,
    country: String,
    pincode: String,
    geo: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0], index: '2dsphere' },
    },
}, { _id: false })


const PostSchema = new mongoose.Schema({
    type: { type: String, enum: POST_TYPES, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: String,
    description: String,
    photos: [String],
    location: AddressSchema,
    rent: Number, // for OFFERING: rent per room/unit; for LOOKING/TEAM_UP: budget per person
    roomType: { type: String, enum: roomType },
    furnishing: { type: String, enum: furnishedType },
    moveInDate: Date,
    duration: { type: String, enum: durationType },
    leaseType: { type: String, enum: leaseType },
    gender: { type: String, enum: ['any', 'male', 'female', 'nonbinary'] },
    lifestyleTags: [String],
    ageRange: {
        min: Number,
        max: Number
    },
    status: { type: String, enum: ['active', 'closed'], default: 'active', index: true },
    interestedCount: { type: Number, default: 0 }, // derived but cached for sort
}, { timestamps: true })

PostSchema.index({ 'rent.amount': 1 })
PostSchema.index({ lifestyle: 1 })

export default mongoose.model('Post', PostSchema)