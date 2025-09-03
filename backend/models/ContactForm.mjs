import mongoose from "mongoose";

const ContactFormSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now }
}, {
    versionKey: false
});

export default mongoose.model("ContactForm", ContactFormSchema);