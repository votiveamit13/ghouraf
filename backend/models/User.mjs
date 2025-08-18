import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  fullName: String,
  age: Number,
  gender: { type: String, enum: ['male', 'female'], index: true },
  occupation: String,
  bio: { type: String, index: 'text' },
  city: { type: String, index: true },
  state: String,
  country: String,
  lifestyleTags: [String], // e.g., non-smoker, early-riser
  photos: [String], // cloudinary URLs
})

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  isVarified: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  status: { type: String, enum: ['active', 'banned'], default: 'active' },
  profile: ProfileSchema,
}, {
  toJSON: {
    transform: function (doc, ret) {
      delete ret.password;
      return ret;
    }
  },
  toObject: {
    transform: function (doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

export default mongoose.model("User", userSchema);
