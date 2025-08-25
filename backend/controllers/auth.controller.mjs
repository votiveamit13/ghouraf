import { authAdmin } from "../config/firebase.mjs";
import User from "../models/User.mjs";
import { profileValidator } from "../validations/profile.validator.mjs";
import { sendEmail } from "../utils/email.mjs";

export const signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName, gender, dob, termsAccepted } = req.body;

    const fbUser = await authAdmin.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`.trim(),
    });

    try {
      const actionCodeSettings = {
        url: `${process.env.FRONTEND_URL}/auth/verified`,
        handleCodeInApp: false,
      };
      const verifyLink = await authAdmin.generateEmailVerificationLink(email, actionCodeSettings);

      await sendEmail({
        to: email,
        subject: "Verify your email",
        html: `<p>Hi ${firstName},</p>
               <p>Please confirm your email by clicking the link below:</p>
               <p><a href="${verifyLink}">Verify Email</a></p>`
      });

      const profile = { firstName, lastName, gender, dob };
      const user = await User.create({
        firebaseUid: fbUser.uid,
        email,
        termsAccepted,
        profile,
      });

      return res.status(201).json({
        message: "Signup successful. Verification email sent.",
        data: user,
      });
    } catch (mongoOrMailErr) {
      await authAdmin.deleteUser(fbUser.uid);
      console.error("Signup rollback: deleted Firebase user due to error", mongoOrMailErr);
      throw mongoOrMailErr;
    }
  } catch (err) {
    console.error("Signup error:", err);

    if (err.code === "auth/email-already-exists") {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (err.code === "auth/invalid-email") {
      return res.status(400).json({ message: "Invalid email address" });
    }
    if (err.code === "auth/invalid-password") {
      return res.status(400).json({ message: "Password is too weak" });
    }

    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists in database" });
    }

    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};


export const login = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: "idToken is required" });

    const decoded = await authAdmin.verifyIdToken(idToken);
    const user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!decoded.email_verified) {
      return res.status(403).json({ message: "Please verify your email first", emailVerified: false });
    }

    res.json({ message: "Login success", emailVerified: true, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(401).json({ message: "Invalid or expired token", error: err.message });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "email is required" });

    const actionCodeSettings = {
      url: `${process.env.FRONTEND_URL}/auth/verified`,
      handleCodeInApp: false,
    };
    const link = await authAdmin.generateEmailVerificationLink(email, actionCodeSettings);

await sendEmail({
  to: email,
  subject: "Resend: verify your email",
  html: `<p>Click the link to verify your email:</p>
         <p><a href="${link}">Verify Email</a></p>`,
});


    res.json({ message: "Verification email resent" });
  } catch (err) {
    console.error("Resend error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  const { error } = profileValidator.validate(req.body, { abortEarly: false });
  if (error) return res.status(422).json(validationFormate(error));

  const allowed = ['firstName', 'lastName', 'age', 'gender', 'occupation', 'bio', 'city', 'state', 'country', 'lifestyleTags', 'photos'];
  const sets = {};
  for (const k of allowed) if (k in req.body) sets[`profile.${k}`] = req.body[k];

  await User.findByIdAndUpdate(req.user._id, { $set: sets });
  res.json({ message: 'Profile updated' });
};

export const getProfile = async (req, res) => {
  res.json(req.user);
};
