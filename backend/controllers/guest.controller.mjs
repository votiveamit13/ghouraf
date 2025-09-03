import ContactForm from "../models/ContactForm.mjs";

export const sendMessage = async (req, res) => {
    try {
        const { fullName, email, subject, message } = req.body;

        const contactForm = await ContactForm.create({ fullName, email, subject, message });

        return res.status(201).json({
            message: "Message received. We'll get back to you shortly.",
            data: contactForm
        });
    } catch (err) {
        console.error("createContact error", err );
        return res.status(500).json({ message: "Server error" });
    }
};
