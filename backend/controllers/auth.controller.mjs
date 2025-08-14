import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.mjs";

export const signup = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                message: "Validation error",
                errors: errors.array().map(err => err.msg)
            });
        }

        const { email, password } = req.body;

        // Check admin existence
        const isExist = await User.findOne({ email });
        if (isExist) {
            return res.status(400).json({ message: "Email is alredy exist" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email: email, password: hashedPassword });

        // Generate token
        const token = jwt.sign(
            { id: user._id, role: "user" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({ "message": "Signup successfully", data: user, token: token });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Server error" });
    }
}