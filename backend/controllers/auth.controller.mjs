import { authAdmin } from "../config/firebase.mjs";
import User from "../models/User.mjs";
import { profileValidator } from "../validations/profile.validator.mjs";
import { sendEmail } from "../utils/email.mjs";
import bcrypt from "bcrypt";
import { fileHandler } from "../utils/fileHandler.mjs";

const validationFormat = (error) => {
  return error.details.map((d) => ({
    field: d.path.join("."),
    message: d.message,
  }));
};

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
        html: `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Email Verification</title>
    </head>
    <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f4f4f4">
        <tr>
          <td align="center" style="padding:40px 0;">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
              <tr>
                <td align="center" bgcolor="#A321A6" style="padding:20px;">
                  <h1 style="color:#ffffff; margin:0; font-size:24px;">Welcome to Ghouraf</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:30px; color:#333333; font-size:16px; line-height:1.5;">
                  <p>Hi <b>${firstName}</b>,</p>
                  <p>Thanks for signing up! Please confirm your email address by clicking the button below.</p>
                  <table border="0" cellspacing="0" cellpadding="0" style="margin:30px auto;">
                    <tr>
                      <td align="center" bgcolor="#A321A6" style="border-radius:6px;">
                        <a href="${verifyLink}" target="_blank" style="display:inline-block; padding:12px 25px; font-size:16px; color:#ffffff; text-decoration:none; font-weight:bold; border-radius:6px;">
                          Verify Email
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p>If the button doesn’t work, copy and paste this link into your browser:</p>
                  <p style="word-break:break-all; color:#A321A6;"><a href="${verifyLink}" target="_blank" style="color:#A321A6;">${verifyLink}</a></p>
                </td>
              </tr>
              <tr>
                <td align="center" bgcolor="#f4f4f4" style="padding:15px; font-size:12px; color:#666;">
                  Ghouraf. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `
      });

      const hashedPassword = await bcrypt.hash(password, 10);

      const profile = { firstName, lastName, gender, dob };
      const user = await User.create({
        firebaseUid: fbUser.uid,
        email,
        termsAccepted,
        password: hashedPassword,
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

    if(user.status === "inactive") {
      return res.status(403).json({
        message: "Your account is banned. Kindly contact support.",
        inactive: true,
      });
    }

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
      subject: "Resend: Verify your email",
      html: `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Resend Verification</title>
    </head>
    <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f4f4f4">
        <tr>
          <td align="center" style="padding:40px 0;">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
              <tr>
                <td align="center" bgcolor="#A321A6" style="padding:20px;">
                  <h1 style="color:#ffffff; margin:0; font-size:22px;">Verify Your Email</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:30px; color:#333333; font-size:16px; line-height:1.5;">
                  <p>Hi there,</p>
                  <p>We noticed you haven’t verified your email yet. Please click the button below to confirm your email address and activate your account.</p>
                  <table border="0" cellspacing="0" cellpadding="0" style="margin:30px auto;">
                    <tr>
                      <td align="center" bgcolor="#A321A6" style="border-radius:6px;">
                        <a href="${link}" target="_blank" style="display:inline-block; padding:12px 25px; font-size:16px; color:#ffffff; text-decoration:none; font-weight:bold; border-radius:6px;">
                          Verify Email
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p>If the button doesn’t work, copy and paste this link into your browser:</p>
                  <p style="word-break:break-all; color:#A321A6;">
                    <a href="${link}" target="_blank" style="color:#A321A6;">${link}</a>
                  </p>
                </td>
              </tr>
              <tr>
                <td align="center" bgcolor="#f4f4f4" style="padding:15px; font-size:12px; color:#666;">
                  This is an automated message. If you already verified, you can safely ignore this email.<br/>
                  Ghouraf. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `
    });



    res.json({ message: "Verification email resent" });
  } catch (err) {
    console.error("Resend error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { section } = req.body;
    let updates = {};

    const user = await User.findById(req.user._id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (section === "name") {
      const { firstName, lastName, password } = req.body;
      if (!firstName || !lastName || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ message: "Invalid password" });

      updates["profile.firstName"] = firstName;
      updates["profile.lastName"] = lastName;

      await authAdmin.updateUser(user.firebaseUid, {
        displayName: `${firstName} ${lastName}`,
      });
    }

else if (section === "email") {
  const { email, confirmEmail, password } = req.body;
  if (!email || !confirmEmail || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (email !== confirmEmail) {
    return res.status(400).json({ message: "Emails do not match" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid password" });

  const newEmail = email.toLowerCase();

  const emailExists = await User.findOne({
    email: newEmail,
    _id: { $ne: user._id },
  });
  if (emailExists) {
    return res.status(400).json({ message: "Email already exists in system" });
  }

  try {
    const existingFbUser = await authAdmin.getUserByEmail(newEmail);
    if (existingFbUser && existingFbUser.uid !== user.firebaseUid) {
      return res.status(400).json({ message: "Email already exists in Firebase" });
    }
  } catch (fbErr) {
    if (fbErr.code !== "auth/user-not-found") {
      console.error("Firebase email check error:", fbErr);
      return res.status(500).json({ message: "Error checking email in Firebase" });
    }
  }

  await authAdmin.updateUser(user.firebaseUid, { email: newEmail });

  updates.email = newEmail;
}


    else if (section === "password") {
      const { currentPassword, newPassword, confirmPassword } = req.body;
      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) return res.status(401).json({ message: "Invalid password" });

      const hashed = await bcrypt.hash(newPassword, 10);

      await authAdmin.updateUser(user.firebaseUid, { password: newPassword });

      updates.password = hashed;
    }

    else if (section === "profile") {
      if (!req.body) {
        return res.status(400).json({ message: "No profile data received" });
      }

      const { error } = profileValidator.validate(req.body, { abortEarly: false });
      if (error) return res.status(422).json(validationFormat(error));

      const allowed = [
        "firstName",
        "lastName",
        "age",
        "mobile",
        "gender",
        "dob",
        "occupation",
        "bio",
        "city",
        "state",
        "country",
        "lifestyleTags",
      ];

      const sets = {};
      for (const k of allowed) {
        if (k in req.body) {
          sets[`profile.${k}`] = req.body[k];
        }
      }

      if (req.file) {
        fileHandler.validateExtension(req.file.originalname, "image");
        const savedFile = fileHandler.saveFile(req.file, "profile_pics");
  const photoUrl = `${process.env.FRONTEND_URL}${savedFile.relativePath}`;
  sets["profile.photo"] = photoUrl;
      }

      updates = { ...updates, ...sets };
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: "No valid updates provided" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    );

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const getProfile = async (req, res) => {
  res.json(req.user);
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select(
      "_id profile.firstName profile.lastName profile.photo email createdAt"
    );

    if(!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};