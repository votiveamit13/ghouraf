import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  mobile: Number,
  gender: { type: String, enum: ["male", "female"], index: true },
  dob: Date,
  occupation: String,
  bio: { type: String, index: "text" },
  city: { type: String, index: true },
  state: String,
  country: String,
  lifestyleTags: [String],
  photo: String,
});

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
   type: String,
  required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    termsAccepted: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "banned"], default: "active" },
    profile: ProfileSchema,
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

export default mongoose.model("User", userSchema);
