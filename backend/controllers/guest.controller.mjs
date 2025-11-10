import Ad from "../models/Ad.mjs";
import ContactForm from "../models/ContactForm.mjs";
import Faq from "../models/faq.mjs";
import Policy from "../models/Policy.mjs";

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

export const getAllFaq = async (req, res) => {
    try {
       const faqs = await Faq.find({ status: "active" }).sort({ createdAt: -1 });

       return res.status(200).json({
        message: "Active FAQs fetched successfully",
        data: faqs
       });
    } catch (err) {
        console.error("getAllFaq error", err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getPolicyByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const policy = await Policy.findOne({ category });
    if (!policy)
      return res.status(404).json({ message: `${category} policy not found` });
    res.status(200).json(policy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPublicAds = async (req, res) => {
  try {
    const { status, page = 1, limit = 4 } = req.query;
    const query = status ? { status } : {};

    const skip = (page - 1) * limit;

    const ads = await Ad.find(query)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    const total = await Ad.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: ads,
    });
  } catch (err) {
    console.error("Error fetching ads:", err);
    res.status(500).json({ message: "Failed to fetch ads" });
  }
};
