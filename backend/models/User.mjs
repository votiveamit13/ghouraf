import mongoose from "mongoose";

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
  is_varified: {
    type: Boolean,
    default: false
  },
  is_admin: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model("User", userSchema);
