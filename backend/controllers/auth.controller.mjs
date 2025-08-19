import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.mjs";
import { profileValidator } from "../validations/profile.validator.mjs";


export const signup = async (req, res) => {
    try {

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

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, role: "user" },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.json({ "message": "Login success", token: token });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
}

export const updateProfile = async (req, res) => {


    const { error } = profileValidator.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(422).json(validationFormate(error));
    }

    const allowed = ['fullName', 'age', 'gender', 'occupation', 'bio', 'city', 'state', 'country', 'lifestyleTags', 'photos']
    const sets = {}
    for (const k of allowed) if (k in req.body) sets[`profile.${k}`] = req.body[k]
    await User.findByIdAndUpdate(req.user._id, { $set: sets })
    res.json({ message: 'Profile updated' })
}

export const getProfile = async (req, res) => {
    res.json(req.user);
}