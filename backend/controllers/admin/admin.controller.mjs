import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.mjs";
import { authAdmin } from "../../config/firebase.mjs";
import { fileHandler } from "../../utils/fileHandler.mjs";
import ContactForm from "../../models/ContactForm.mjs";
import Faq from "../../models/faq.mjs";
import faq from "../../models/faq.mjs";
import Space from "../../models/Space.mjs";
import TeamUp from "../../models/TeamUp.mjs";
import SpaceWanted from "../../models/SpaceWanted.mjs";
import { HeroImage } from "../../models/HeroImage.mjs";
import fs from "fs";
import path from "path";
import Policy from "../../models/Policy.mjs";
import Report from "../../models/Report.mjs";
import Ad from "../../models/Ad.mjs";
import { AboutUsImage } from "../../models/AboutUsImage.mjs";
import Newsletter from "../../models/Newsletter.mjs";
import { dbAdmin } from "../../config/firebase.mjs";
import { sendEmail } from "../../utils/email.mjs";

const modelMap = {
  Space,
  SpaceWanted,
  TeamUp,
};

const sendPostUpdateEmail = async (to, firstName, title, body) => {
  await sendEmail({
    to,
    subject: "Update on your Ghouraf Post",
    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Post Update</title>
      </head>
      <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f4f4f4">
          <tr>
            <td align="center" style="padding:40px 0;">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                <tr>
                  <td align="center" bgcolor="#A321A6" style="padding:20px;">
                    <h1 style="color:#ffffff; margin:0; font-size:24px;">Ghouraf Notification</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:30px; color:#333333; font-size:16px; line-height:1.5;">
                    <p>Hi <b>${firstName}</b>,</p>

                    <p>${body}</p>

                    <p style="margin-top:25px;">Post Title:</p>
                    <p style="font-weight:bold; color:#A321A6;">${title}</p>

                    <p style="margin-top:20px;">If you have any questions, feel free to contact support.</p>
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
    </html>`
  });
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!admin.isAdmin) {
      return res.status(403).json({ message: "Access denied. Not an admin account." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ "message": "Login success", token: token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: { $ne: true } })
      .select("-password -__v");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isAdmin) return res.status(403).json({ message: "Cannot change admin status" });

    user.status = status;
    await user.save();

    // 5b) OPTIONAL: also toggle Firebase disabled flag
    // if (user.firebaseUid) {
    //   await authAdmin.updateUser(user.firebaseUid, { disabled: status === "inactive" });
    // }

    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.__v;

    res.json({ message: `User ${status} successfully`, user: safeUser });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    let updates = {};

    const user = await User.findById(id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isAdmin) return res.status(403).json({ message: "Admins cannot be modified" });

    if (req.body.email) {
      const newEmail = req.body.email.toLowerCase();

      const emailExists = await User.findOne({ email: newEmail, _id: { $ne: id } });
      if (emailExists) {
        return res.status(400).json({ message: "Email already exists" });
      }

      try {
        const fbUser = await authAdmin.getUserByEmail(newEmail);
        if (fbUser && fbUser.uid !== user.firebaseUid) {
          return res.status(400).json({ message: "Email already exist" });
        }
      } catch (err) {
        if (err.code !== "auth/user-not-found") {
          return res.status(500).json({ message: "Error checking" });
        }
      }

      await authAdmin.updateUser(user.firebaseUid, { email: newEmail });
      updates.email = newEmail;
    }

    if (req.body.newPassword) {
      if (req.body.confirmPassword && req.body.newPassword !== req.body.confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      const hashed = await bcrypt.hash(req.body.newPassword, 10);

      await authAdmin.updateUser(user.firebaseUid, { password: req.body.newPassword });

      updates.password = hashed;
    }

    if (req.body.firstName || req.body.lastName) {
      const firstName = req.body.firstName || user.profile?.firstName;
      const lastName = req.body.lastName || user.profile?.lastName;

      updates["profile.firstName"] = firstName;
      updates["profile.lastName"] = lastName;

      await authAdmin.updateUser(user.firebaseUid, {
        displayName: `${firstName} ${lastName}`.trim(),
      });
    }

    const allowed = [
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
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        sets[`profile.${key}`] = req.body[key];
      }
    }

    if (req.file) {
      fileHandler.validateExtension(req.file.originalname, "image");
      const savedFile = fileHandler.saveFile(req.file, "profile_pics");
      const photoUrl = `${process.env.FRONTEND_URL}${savedFile.relativePath}`;
      sets["profile.photo"] = photoUrl;
    }

    updates = { ...updates, ...sets };
    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: "No valid updates provided" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    ).select("-password -__v");

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Admin update user error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.isAdmin)
      return res.status(403).json({ message: "Admins cannot be deleted" });

    if (user.firebaseUid) {
      try {
        await authAdmin.deleteUser(user.firebaseUid);
      } catch (err) {
        console.error("Error deleting Firebase user", err);
        return res.status(500).json({
          message: "Failed to delete user",
          error: err.message,
        });
      }
    }

    await Promise.all([
      Space.deleteMany({ user: id }),
      SpaceWanted.deleteMany({ user: id }),
      TeamUp.deleteMany({ user: id }),
    ]);

    await User.findByIdAndDelete(id);

    return res.json({
      message: "User and all associated posts deleted successfully",
    });

  } catch (err) {
    console.error("Admin delete user error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

export const getAllMessage = async (req, res) => {
  try {
    const messages = await ContactForm.find().select("-__v");
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await ContactForm.findById(id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    await ContactForm.findByIdAndDelete(id);

    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("Admin delete message error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const addFaq = async (req, res) => {
  try {
    const { question, answer, status } = req.body;

    const faq = await Faq.create({ question, answer, status });

    return res.status(201).json({
      message: "FAQ Added",
      data: faq
    });
  } catch (err) {
    console.error("FAQ Added error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllFaq = async (req, res) => {
  try {
    const faqs = await Faq.find().select("-__v");
    res.json(faqs);
  } catch (err) {
    console.error("Error fecthing FAQs:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export const updateFaqStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const faq = await Faq.findById(id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    faq.status = status;
    await faq.save();

    const safeFaq = faq.toObject();
    delete safeFaq.__v;
    res.json({ message: `FAQ ${status} successfully`, faq: safeFaq });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    if (!question && !answer) {
      return res.status(400).json({ message: "No valid fields provided to update" });
    }

    const updates = {};
    if (question) updates.question = question;
    if (answer) updates.answer = answer;

    const updatedFaq = await Faq.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    ).select("-__v");

    if (!updatedFaq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.json({
      message: "FAQ updated successfully",
      faq: updatedFaq
    });
  } catch (err) {
    console.error("Admin update FAQ error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await Faq.findById(id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    await Faq.findByIdAndDelete(id);

    res.json({ message: "FAQ deleted successfully" });
  } catch (err) {
    console.error("Admin delete FAQ error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAllSpaces = async (req, res) => {
  try {
    const spaces = await Space.find({ is_deleted: false })
      .populate("user", "profile.firstName profile.lastName profile.photo")
      .select(
        "title propertyType budget budgetType user available status createdAt description size furnishing smoking amenities featuredImage photos promotion"
      );

    res.json(spaces);
  } catch (err) {
    console.error("Error fetching spaces:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateSpaceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const space = await Space.findById(id).populate("user");
    if (!space) return res.status(404).json({ message: "Space not found" });

    space.status = status;
    await space.save();

    await dbAdmin.collection("notifications").add({
      userId: space.user._id.toString(),
      senderId: req.user?._id || "admin",
      title: "Your space post status was updated",
      body: `Your post "${space.title}" is now ${status}.`,
      meta: {
        firstName: space.user.firstName || "",
        lastName: space.user.lastName || "",
        email: space.user.email || "",
        postId: space._id.toString(),
        postCategory: "Space",
      },
      read: false,
      createdAt: new Date(),
    });

    await sendPostUpdateEmail(
      space.user.email,
      space.user.profile.firstName,
      space.title,
      `Your post <b>${space.title}</b> is now <b>${status}</b>.`
    );

    res.json({ message: `Space status updated to ${status}`, space });
  } catch (err) {
    console.error("Error updating space status:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteSpace = async (req, res) => {
  try {
    const { id } = req.params;

    const space = await Space.findById(id).populate("user");
    if (!space) return res.status(404).json({ message: "Space not found" });

    if (space.is_deleted) {
      return res.status(400).json({ message: "Space already deleted" });
    }

    space.is_deleted = true;
    await space.save();

    await dbAdmin.collection("notifications").add({
      userId: space.user._id.toString(),
      senderId: req.user?._id || "admin",
      title: "Your space post was deleted",
      body: `Your post "${space.title}" has been removed by admin.`,
      meta: {
        firstName: space.user.firstName || "",
        lastName: space.user.lastName || "",
        email: space.user.email || "",
        postId: space._id.toString(),
        postCategory: "Space",
      },
      read: false,
      createdAt: new Date(),
    });

    await sendPostUpdateEmail(
      space.user.email,
      space.user.profile.firstName,
      space.title,
      `Your post <b>${space.title}</b> has been <span style="color:red;">deleted</span> by admin.`
    );



    res.json({ message: "Space deleted successfully", space });
  } catch (err) {
    console.error("Error deleting space:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleSpaceAdminPromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const { promote } = req.body;

    const space = await Space.findById(id);
    if (!space) return res.status(404).json({ message: "Space not found" });

    if (promote) {
      space.promotion.isPromoted = true;
      space.promotion.promotionType = "admin";
      space.promotion.paymentStatus = "success";
      space.promotion.startDate = new Date();
      space.promotion.endDate = null;
    } else {
      space.promotion.isPromoted = false;
      space.promotion.promotionType = "admin";
      space.promotion.endDate = null;
    }

    await space.save();
    res.json({ message: "Promotion updated successfully" });
  } catch (error) {
    console.error("Admin promotion update error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllTeamUps = async (req, res) => {
  try {
    const teamups = await TeamUp.find({ is_deleted: false })
      .populate("user", "profile.firstName profile.lastName profile.photo")
      .select(
        "title country state city zip budget budgetType moveInDate period amenities firstName lastName age gender minAge maxAge occupationPreference occupation smoke pets petsPreference language languagePreference roommatePref description buddyDescription photos status available createdAt promotion"
      );

    const spaceWantedTeamUps = await SpaceWanted.find({
      is_deleted: false,
      teamUp: true,
    })
      .populate("user", "profile.firstName profile.lastName profile.photo")
      .select(
        "propertyType country state city zip budget budgetType title roommatePref moveInDate roomSize furnishing gender description photos status available createdAt promotion"
      );

    const merged = [...teamups, ...spaceWantedTeamUps].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(merged);
  } catch (err) {
    console.error("Error fetching team-ups:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTeamUpStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    let teamup = await TeamUp.findById(id).populate("user");
    if (teamup) {
      teamup.status = status;
      await teamup.save();

      await dbAdmin.collection("notifications").add({
        userId: teamup.user._id.toString(),
        senderId: req.user?._id || "admin",
        title: "Your Team Up post status was updated",
        body: `Your Team Up post "${teamup.title}" is now ${status}.`,
        meta: {
          firstName: teamup.user.firstName || "",
          lastName: teamup.user.lastName || "",
          email: teamup.user.email || "",
          postId: teamup._id.toString(),
          postCategory: "Teamup",
        },
        read: false,
        createdAt: new Date(),
      });

      await sendPostUpdateEmail(
        teamup.user.email,
        teamup.user.profile.firstName,
        teamup.title,
        `Your post <b>${teamup.title}</b> is now <b>${status}</b>.`
      );

      return res.json({ message: `Team Up status updated to ${status}`, teamup });
    }

    let spaceWanted = await SpaceWanted.findById(id).populate("user");
    if (spaceWanted && spaceWanted.teamUp) {
      spaceWanted.status = status;
      await spaceWanted.save();

      await dbAdmin.collection("notifications").add({
        userId: spaceWanted.user._id.toString(),
        senderId: req.user?._id || "admin",
        title: "Your Team Up (Space Wanted) post status was updated",
        body: `Your Space Wanted post "${spaceWanted.title}" is now ${status}.`,
        meta: {
          firstName: spaceWanted.user.firstName || "",
          lastName: spaceWanted.user.lastName || "",
          email: spaceWanted.user.email || "",
          postId: spaceWanted._id.toString(),
          postCategory: "Teamup",
        },
        read: false,
        createdAt: new Date(),
      });

      await sendPostUpdateEmail(
        spaceWanted.user.email,
        spaceWanted.user.profile.firstName,
        spaceWanted.title,
        `Your post <b>${spaceWanted.title}</b> is now <b>${status}</b>.`
      );
      return res.json({ message: `Team Up (SpaceWanted) status updated to ${status}`, spaceWanted });
    }

    return res.status(404).json({ message: "Team Up not found" });
  } catch (err) {
    console.error("Error updating team up status:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTeamUp = async (req, res) => {
  try {
    const { id } = req.params;

    let teamup = await TeamUp.findById(id).populate("user");
    if (teamup) {
      if (teamup.is_deleted)
        return res.status(400).json({ message: "Team Up already deleted" });

      teamup.is_deleted = true;
      await teamup.save();

      await dbAdmin.collection("notifications").add({
        userId: teamup.user._id.toString(),
        senderId: req.user?._id || "admin",
        title: "Your Team Up post was deleted",
        body: `Your post "${teamup.title}" has been removed by admin.`,
        meta: {
          firstName: teamup.user.firstName || "",
          lastName: teamup.user.lastName || "",
          email: teamup.user.email || "",
          postId: teamup._id.toString(),
          postCategory: "Teamup",
        },
        read: false,
        createdAt: new Date(),
      });

      await sendPostUpdateEmail(
        teamup.user.email,
        teamup.user.profile.firstName,
        teamup.title,
        `Your post <b>${teamup.title}</b> has been <span style="color:red;">deleted</span> by admin.`
      );

      return res.json({ message: "Team Up deleted successfully", teamup });
    }

    let spaceWanted = await SpaceWanted.findById(id).populate("user");
    if (spaceWanted && spaceWanted.teamUp) {
      if (spaceWanted.is_deleted)
        return res.status(400).json({ message: "Team Up already deleted" });

      spaceWanted.is_deleted = true;
      await spaceWanted.save();

      await dbAdmin.collection("notifications").add({
        userId: spaceWanted.user._id.toString(),
        senderId: req.user?._id || "admin",
        title: "Your Team Up (Space Wanted) post was deleted",
        body: `Your Space Wanted post "${spaceWanted.title}" has been removed by admin.`,
        meta: {
          firstName: spaceWanted.user.firstName || "",
          lastName: spaceWanted.user.lastName || "",
          email: spaceWanted.user.email || "",
          postId: spaceWanted._id.toString(),
          postCategory: "Teamup",
        },
        read: false,
        createdAt: new Date(),
      });

      await sendPostUpdateEmail(
        spaceWanted.user.email,
        spaceWanted.user.profile.firstName,
        spaceWanted.title,
        `Your post <b>${spaceWanted.title}</b> has been <span style="color:red;">deleted</span> by admin.`
      );
      return res.json({ message: "Team Up (SpaceWanted) deleted successfully", spaceWanted });
    }

    res.status(404).json({ message: "Team Up not found" });
  } catch (err) {
    console.error("Error deleting team up:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleTeamUpAdminPromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const { promote } = req.body;

    const teamup = await TeamUp.findById(id);
    if (!teamup) return res.status(404).json({ message: "Team Up not found" });

    if (promote) {
      teamup.promotion.isPromoted = true;
      teamup.promotion.promotionType = "admin";
      teamup.promotion.paymentStatus = "success";
      teamup.promotion.startDate = new Date();
      teamup.promotion.endDate = null;
    } else {
      teamup.promotion.isPromoted = false;
      teamup.promotion.promotionType = "admin";
      teamup.promotion.endDate = null;
    }

    await teamup.save();
    res.json({ message: "Promotion updated successfully" });
  } catch (error) {
    console.error("Admin promotion update error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllSpaceWanted = async (req, res) => {
  try {
    const spacewanted = await SpaceWanted.find({ is_deleted: false })
      .populate("user", "profile.firstName profile.lastName profile.photo")
      .select(
        "title country state city zip budget budgetType propertyType roomSize moveInDate period amenities firstName lastName name age gender occupation smoke pets language roommatePref description photos teamUp status available createdAt promotion"
      );

    res.json(spacewanted);
  } catch (err) {
    console.error("Error fetching team-ups:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateSpaceWantedStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const spacewanted = await SpaceWanted.findById(id).populate("user");
    if (!spacewanted) return res.status(404).json({ message: "Space Wanted not found" });

    spacewanted.status = status;
    await spacewanted.save();

    await dbAdmin.collection("notifications").add({
      userId: spacewanted.user._id.toString(),
      senderId: req.user?._id || "admin",
      title: "Your space wanted post status was updated",
      body: `Your post "${spacewanted.title}" is now ${status}.`,
      meta: {
        firstName: spacewanted.user.firstName || "",
        lastName: spacewanted.user.lastName || "",
        email: spacewanted.user.email || "",
        postId: spacewanted._id.toString(),
        postCategory: "Spacewanted",
      },
      read: false,
      createdAt: new Date(),
    });

    await sendPostUpdateEmail(
      spacewanted.user.email,
      spacewanted.user.profile.firstName,
      spacewanted.title,
      `Your post <b>${spacewanted.title}</b> is now <b>${status}</b>.`
    );

    res.json({ message: `Space Wanted status updated to ${status}`, spacewanted });
  } catch (err) {
    console.error("Error updating space wanted status:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteSpaceWanted = async (req, res) => {
  try {
    const { id } = req.params;

    const spacewanted = await SpaceWanted.findById(id).populate("user");
    if (!spacewanted) return res.status(404).json({ message: "Space Wanted not found" });

    if (spacewanted.is_deleted) {
      return res.status(400).json({ message: "Space Wanted already deleted" });
    }

    spacewanted.is_deleted = true;
    await spacewanted.save();

    await dbAdmin.collection("notifications").add({
      userId: spacewanted.user._id.toString(),
      senderId: req.user?._id || "admin",
      title: "Your space wanted post was deleted",
      body: `Your post "${spacewanted.title}" has been removed by admin.`,
      meta: {
        firstName: spacewanted.user.firstName || "",
        lastName: spacewanted.user.lastName || "",
        email: spacewanted.user.email || "",
        postId: spacewanted._id.toString(),
        postCategory: "Spacewanted",
      },
      read: false,
      createdAt: new Date(),
    });

    await sendPostUpdateEmail(
      spacewanted.user.email,
      spacewanted.user.profile.firstName,
      spacewanted.title,
      `Your post <b>${spacewanted.title}</b> has been <span style="color:red;">deleted</span> by admin.`
    );

    res.json({ message: "Space Wanted deleted successfully", spacewanted });
  } catch (err) {
    console.error("Error deleting space wanted:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleSpaceWantedAdminPromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const { promote } = req.body;

    const spacewanted = await SpaceWanted.findById(id);
    if (!spacewanted) return res.status(404).json({ message: "Space Wanted not found" });

    if (promote) {
      spacewanted.promotion.isPromoted = true;
      spacewanted.promotion.promotionType = "admin";
      spacewanted.promotion.paymentStatus = "success";
      spacewanted.promotion.startDate = new Date();
      spacewanted.promotion.endDate = null;
    } else {
      spacewanted.promotion.isPromoted = false;
      spacewanted.promotion.promotionType = "admin";
      spacewanted.promotion.endDate = null;
    }

    await spacewanted.save();
    res.json({ message: "Promotion updated successfully" });
  } catch (error) {
    console.error("Admin promotion update error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//home screen image
export const getHomeImage = async (req, res) => {
  try {
    const home = await HeroImage.findOne().sort({ createdAt: -1 });

    if (!home) {
      return res.status(404).json({ message: "Home image not set." });
    }

    res.status(200).json({
      message: "Home image fetched successfully.",
      imagePath: home.imagePath,
    });
  } catch (error) {
    console.error("Error fetching home image:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateHomeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded." });
    }

    fileHandler.validateExtension(req.file.originalname, "image");

    const saved = fileHandler.saveFile(req.file, "home");

    let home = await HeroImage.findOne();

    if (home) {
      if (home.imagePath) {
        const oldPath = home.imagePath.replace("/uploads/", "");
        const oldFilePath = path.join(process.cwd(), "uploads", oldPath);

        try {
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        } catch (err) {
          console.warn("Failed to delete old image:", err.message);
        }
      }

      home.imagePath = saved.relativePath;
      await home.save();
    } else {
      home = await HeroImage.create({ imagePath: saved.relativePath });
    }

    res.status(200).json({
      message: "Home image updated successfully.",
      imagePath: saved.relativePath,
    });
  } catch (error) {
    console.error("Error updating home image:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAboutUsImage = async (req, res) => {
  try {
    const aboutus = await AboutUsImage.findOne().sort({ createdAt: -1 });

    if (!aboutus) {
      return res.status(404).json({ message: "About Us images not set." });
    }

    res.status(200).json({
      message: "Images fetched successfully.",
      imagePath1: aboutus.imagePath1,
      imagePath2: aboutus.imagePath2,
      imagePath3: aboutus.imagePath3,
    });
  } catch (error) {
    console.error("Error fetching About Us images:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateAboutUsImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image1 || !req.files.image2 || !req.files.image3) {
      return res.status(400).json({ message: "All three images are required." });
    }

    const saved1 = fileHandler.saveFile(req.files.image1[0], "about-us");
    const saved2 = fileHandler.saveFile(req.files.image2[0], "about-us");
    const saved3 = fileHandler.saveFile(req.files.image3[0], "about-us");

    let aboutus = await AboutUsImage.findOne();

    if (aboutus) {
      [aboutus.imagePath1, aboutus.imagePath2, aboutus.imagePath3].forEach((oldPath) => {
        if (oldPath) {
          const fullPath = path.join(process.cwd(), "uploads", oldPath.replace("/uploads/", ""));
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
      });

      aboutus.imagePath1 = saved1.relativePath;
      aboutus.imagePath2 = saved2.relativePath;
      aboutus.imagePath3 = saved3.relativePath;

      await aboutus.save();
    } else {
      aboutus = await AboutUsImage.create({
        imagePath1: saved1.relativePath,
        imagePath2: saved2.relativePath,
        imagePath3: saved3.relativePath,
      });
    }

    res.status(200).json({
      message: "About Us images updated successfully.",
      imagePath1: aboutus.imagePath1,
      imagePath2: aboutus.imagePath2,
      imagePath3: aboutus.imagePath3,
    });
  } catch (error) {
    console.error("Error updating About Us images:", error);
    res.status(500).json({ message: error.message });
  }
};

//policy management
export const createPolicy = async (req, res) => {
  try {
    const { category, title, content } = req.body;
    if (!category || !title || !content) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existing = await Policy.findOne({ title });
    if (existing) {
      return res.status(400).json({ message: "Policy with this title already exists." });
    }

    const policy = await Policy.create({ category, title, content });
    res.status(201).json(policy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllPolicies = async (req, res) => {
  try {
    const policies = await Policy.find().sort({ updatedAt: -1 });
    res.status(200).json(policies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPolicyById = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) return res.status(404).json({ message: "Policy not found" });
    res.status(200).json(policy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePolicy = async (req, res) => {
  try {
    const { category, title, content } = req.body;
    const policy = await Policy.findById(req.params.id);

    if (!policy) return res.status(404).json({ message: "Policy not found" });

    policy.category = category || policy.category;
    policy.title = title || policy.title;
    policy.content = content || policy.content;
    await policy.save();

    res.status(200).json({ message: "Policy updated successfully", policy });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePolicy = async (req, res) => {
  try {
    const policy = await Policy.findByIdAndDelete(req.params.id);
    if (!policy) return res.status(404).json({ message: "Policy not found" });
    res.status(200).json({ message: "Policy deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//report
export const getAllReports = async (req, res) => {
  try {
    const { status, postType, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.adminAction = status;
    if (postType) query.postType = postType;

    const skip = (page - 1) * limit;

    const reports = await Report.find(query)
      .populate("user", "profile.firstName profile.lastName profile.photo")
      .populate({
        path: "postId",
        populate: { path: "user", select: "profile.firstName profile.lastName profile.photo" },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Report.countDocuments(query);

    res.status(200).json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      reports,
    });
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    let model;
    switch (report.postType) {
      case "Space":
        model = Space;
        break;
      case "SpaceWanted":
        model = SpaceWanted;
        break;
      case "TeamUp":
        model = TeamUp;
        break;
      default:
        return res.status(400).json({ message: "Invalid post type" });
    }

    await model.findByIdAndUpdate(report.postId, {
      $inc: { reportsCount: -1 },
    });

    await Report.findByIdAndDelete(id);

    res.status(200).json({ message: "Report deleted successfully" });
  } catch (err) {
    console.error("Error deleting report:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handlePostAction = async (req, res) => {
  try {
    const { postType, id } = req.params;
    const { action } = req.body;

    const Model = modelMap[postType];
    if (!Model) return res.status(400).json({ message: "Invalid post type" });

    const post = await Model.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    switch (action) {
      case "activate":
        post.status = "active";
        break;
      case "deactivate":
        post.status = "inactive";
        break;
      case "delete":
        post.is_deleted = true;
        break;
      default:
        return res.status(400).json({ message: "Invalid action" });
    }

    await post.save();

    res.json({ success: true, message: `Post ${action}d successfully`, post });
  } catch (error) {
    console.error("Post action error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

//ad management
export const createAd = async (req, res) => {
  try {
    const { title, url } = req.body;
    const file = req.file;

    if (!title || !url || !file) {
      return res.status(400).json({ message: "Title, URL, and Image are required" });
    }

    fileHandler.validateExtension(file.originalname, "image");

    const savedFile = fileHandler.saveFile(file, "ads");

    const newAd = await Ad.create({
      title,
      url,
      image: savedFile.relativePath,
    });

    return res.status(201).json({
      message: "Ad created successfully",
      ad: newAd,
    });
  } catch (err) {
    console.error("Create Ad Error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const updateAd = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url } = req.body;
    const file = req.file;

    const ad = await Ad.findById(id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    let imagePath = ad.image;

    if (file) {
      fileHandler.validateExtension(file.originalname, "image");
      const savedFile = fileHandler.saveFile(file, "ads");

      if (ad.image) {
        const oldPath = ad.image.startsWith("/uploads")
          ? ad.image.replace("/uploads", "uploads")
          : ad.image;
        try {
          fs.unlinkSync(oldPath);
        } catch (e) {
          console.warn("Old image not found:", oldPath);
        }
      }

      imagePath = savedFile.relativePath;
    }

    ad.title = title || ad.title;
    ad.url = url || ad.url;
    ad.image = imagePath;

    await ad.save();

    res.status(200).json({
      message: "Ad updated successfully",
      ad,
    });
  } catch (err) {
    console.error("Update Ad Error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getAllAds = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sort = { createdAt: -1 };

    const [ads, total] = await Promise.all([
      Ad.find().sort(sort).skip(skip).limit(limit),
      Ad.countDocuments(),
    ]);

    res.status(200).json({
      message: "Ads fetched successfully",
      data: ads,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Get All Ads Error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteAd = async (req, res) => {
  try {
    const { id } = req.params;

    const ad = await Ad.findById(id);
    if (!ad) {
      return res.status(404).json({ success: false, message: "Ad not found" });
    }

    if (ad.image && fs.existsSync(`uploads/${ad.image}`)) {
      fs.unlinkSync(`uploads/${ad.image}`);
    }

    await Ad.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Ad deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting ad:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the ad",
    });
  }
};

export const updateAdStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const ad = await Ad.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    return res.status(200).json({
      message: "Status updated successfully",
      data: ad,
    });
  } catch (error) {
    console.error("Error updating ad status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//dashboard insights & charts
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isAdmin: { $ne: true } });

    const adPosts = await Ad.countDocuments();

    const [spaceCount, spaceWantedCount, teamUpCount] = await Promise.all([
      Space.countDocuments({ is_deleted: { $ne: true } }),
      SpaceWanted.countDocuments({ is_deleted: { $ne: true } }),
      TeamUp.countDocuments({ is_deleted: { $ne: true } }),
    ]);

    const totalPosts = spaceCount + spaceWantedCount + teamUpCount;

    const reportsCount = await Report.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        adPosts,
        totalPosts,
        reportsCount,
      },
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

export const getDashboardCharts = async (req, res) => {
  try {
    const period = req.query.period || "month";
    const now = new Date();

    let userActivity = [];
    if (period === "week") {
      const startDate = daysAgo(7);

      const users = await User.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dayOfWeek: "$createdAt" },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      userActivity = weekDays.map((day, i) => ({
        label: day,
        count: users.find((u) => u._id === i + 1)?.count || 0,
      }));
    } else {
      const startDate = daysAgo(28);

      const users = await User.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $project: {
            diffDays: {
              $divide: [{ $subtract: [now, "$createdAt"] }, 1000 * 60 * 60 * 24],
            },
          },
        },
        {
          $project: {
            weekNum: { $ceil: { $divide: ["$diffDays", 7] } },
          },
        },
        { $group: { _id: "$weekNum", count: { $sum: 1 } } },
      ]);

      userActivity = Array.from({ length: 4 }, (_, i) => {
        const found = users.find((u) => u._id === 4 - i);
        return { label: `Week ${i + 1}`, count: found ? found.count : 0 };
      });
    }

    const getPostsData = async (Model) => {
      const startDate = period === "week" ? daysAgo(7) : daysAgo(28);
      const groupStage =
        period === "week"
          ? { $dayOfWeek: "$createdAt" }
          : {
            $ceil: {
              $divide: [
                { $divide: [{ $subtract: [now, "$createdAt"] }, 1000 * 60 * 60 * 24] },
                7,
              ],
            },
          };

      return await Model.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: groupStage, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]);
    };

    const [spaceWanted, spaces, teamUp] = await Promise.all([
      getPostsData(SpaceWanted),
      getPostsData(Space),
      getPostsData(TeamUp),
    ]);

    const timeLabels =
      period === "week"
        ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        : ["Week 1", "Week 2", "Week 3", "Week 4"];

    const normalize = (arr) =>
      timeLabels.map((_, i) => {
        const id = period === "week" ? i + 1 : 4 - i;
        return arr.find((a) => a._id === id)?.count || 0;
      });

    const postsActivity = [
      { label: "Space Wanted", data: normalize(spaceWanted) },
      { label: "Spaces", data: normalize(spaces) },
      { label: "Team Up", data: normalize(teamUp) },
    ];

    res.status(200).json({
      success: true,
      data: {
        userActivity,
        postsActivity,
        labels: timeLabels,
      },
    });
  } catch (error) {
    console.error("Chart Data Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch chart data" });
  }
};

//newsletter
export const getAllNewsletters = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    const query = search
      ? { email: { $regex: search, $options: "i" } }
      : {};

    const total = await Newsletter.countDocuments(query);

    const newsletters = await Newsletter.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      newsletters,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const deleteNewsletter = async (req, res) => {
  try {
    const { id } = req.params;

    const newsletter = await Newsletter.findById(id);
    if (!newsletter) {
      return res.status(404).json({ error: "Newsletter not found" });
    }

    await Newsletter.findByIdAndDelete(id);
    return res.status(200).json({ message: "Newsletter deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const sendNewsletterToSingle = async (req, res) => {
  try {
    const { email, subject, html } = req.body;

    if (!email || !subject || !html) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const subscribed = await Newsletter.findOne({ email });
    if (!subscribed) return res.status(404).json({ message: "Email not found in newsletter list" });

    await sendEmail({
      to: email,
      subject,
      html,
    });

    res.json({ message: `Newsletter sent to ${email}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send newsletter" });
  }
};

export const sendNewsletterBulk = async (req, res) => {
  try {
    const { subject, html } = req.body;

    if (!subject || !html) {
      return res.status(400).json({ message: "Subject and HTML body are required" });
    }

    const subscribers = await Newsletter.find().select("email");
    if (subscribers.length === 0)
      return res.status(404).json({ message: "No newsletter subscribers found" });

    for (const sub of subscribers) {
      await sendEmail({
        to: sub.email,
        subject,
        html,
      });
    }

    res.json({ message: `Newsletter sent to ${subscribers.length} subscribers` });
  } catch (error) {
    console.error("Bulk newsletter error:", error);
  
    res.status(500).json({ message: "Failed to send bulk newsletter" });
  }
};

//admin profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findOne({ isAdmin: true }).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({ message: "Failed to fetch admin details" });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const admin = await User.findOne({ isAdmin: true });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const { firstName, lastName, email, currentPassword, newPassword } = req.body;
    const updates = {};

    if (firstName) updates["profile.firstName"] = firstName;
    if (lastName) updates["profile.lastName"] = lastName;
    if (email) updates.email = email;

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updates.password = hashedPassword;
    }

    if (req.file) {
      try {
        const savedFile = fileHandler.saveFile(req.file, "admin");

        if (admin.profile?.photo) {
          const oldPath = path.join(process.cwd(), admin.profile.photo);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        updates["profile.photo"] = savedFile.relativePath;
      } catch (fileError) {
        console.error("File upload error:", fileError);
        return res.status(400).json({ message: "File upload failed" });
      }
    }

    const updatedAdmin = await User.findByIdAndUpdate(admin._id, updates, {
      new: true,
    }).select("-password");

    res.json({
      message: "Profile updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error("Error updating admin profile:", error);
    res.status(500).json({ message: "Failed to update admin profile" });
  }
};