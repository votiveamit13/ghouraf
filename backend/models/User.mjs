import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  // age: Number,
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

ProfileSchema.virtual("age").get(function () {
  if (!this.dob) return null;

  const dob = new Date(this.dob);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
});

ProfileSchema.set("toJSON", { virtuals: true });
ProfileSchema.set("toObject", { virtuals: true });

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
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    profile: ProfileSchema,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
    toObject: {
       virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

export default mongoose.model("User", userSchema);
