import ContactForm from "../models/ContactForm.mjs";
import Faq from "../models/faq.mjs";
import Space from "../models/Space.mjs";
import TeamUp from "../models/TeamUp.mjs";

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

export const searchLocations = async (req, res) => {
    try {
        const { query } = req.query;
        if(!query || query.trim().length < 2) {
            return res.status(200).json({ data: [] });
        }

        const regex = new RegExp(query, "i");

        const spaceResults = await Space.aggregate([
            {
                $match: {
                    $or: [
                        { city: regex },
                        { state: regex },
                        { country: regex },
                        { location: regex },
                    ],
                },
            },
            {
        $project: {
          _id: 0,
          city: 1,
          state: 1,
          country: 1,
          type: { $literal: "Space" },
        },
      },
      { $limit: 10 },
    ]);
    const teamUpResults = await TeamUp.aggregate([
      {
        $match: {
          $or: [
            { city: regex },
            { state: regex },
            { country: regex },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          city: 1,
          state: 1,
          country: 1,
          type: { $literal: "Teamup" },
        },
      },
      { $limit: 10 },
    ]);

    const combined = [...spaceResults, ...teamUpResults];
    const unique = Array.from(
      new Set(combined.map((i) => `${i.city}-${i.state}-${i.country}`))
    ).map((key) => combined.find((i) => `${i.city}-${i.state}-${i.country}` === key));

    res.json({ data: unique });
  } catch (err) {
    console.error("Location search failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};