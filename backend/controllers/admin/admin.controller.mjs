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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
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
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isAdmin) return res.status(403).json({ message: "Admins cannot be deleted" });

    if (user.firebaseUid) {
      try {
        await authAdmin.deleteUser(user.firebaseUid);
      } catch (err) {
        console.error("Error deleting user", err);
        return res.status(500).json({ message: "Failed to delete user", error: err.message });
      }
    }

    await User.findByIdAndDelete(id);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Admin delete user error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
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
    const {question, answer, status} = req.body;

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

    if(!["active", "inactive"].includes(status)){
      return res.status(400).json({ message: "Invalid status"});
    }

    const faq = await Faq.findById(id);
    if(!faq) return res.status(404).json({ message: "FAQ not found"});

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
        "title propertyType budget budgetType user available status createdAt description size furnishing smoking amenities featuredImage photos"
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

    if(!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const space = await Space.findById(id);
    if(!space) return res.status(404).json({ message: "Space not found" });

    space.status = status;
    await space.save();

    res.json({ message: `Space status updated to ${status}`, space });
  } catch (err) {
    console.error("Error updating space status:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteSpace = async (req, res) => {
  try {
    const { id } = req.params;

    const space = await Space.findById(id);
    if(!space) return res.status(404).json({ message: "Space not found" });

    if(space.is_deleted) {
      return res.status(400).json({ message: "Space already deleted" });
    }

    space.is_deleted = true;
    await space.save();

    res.json({ message: "Space deleted successfully", space });
  } catch (err) {
    console.error("Error deleting space:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllTeamUps = async (req, res) => {
  try {
    const teamups = await TeamUp.find({ is_deleted: false })
      .populate("user", "profile.firstName profile.lastName profile.photo")
      .select(
        "title country state city zip budget budgetType moveInDate period amenities firstName lastName age gender minAge maxAge occupationPreference occupation smoke pets petsPreference language languagePreference roommatePref description buddyDescription photos status available createdAt"
      );

      res.json(teamups);
  } catch (err) {
    console.error("Error fetching team-ups:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTeamUpStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if(!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const teamup = await TeamUp.findById(id);
    if(!teamup) return res.status(404).json({ message: "Team Up not found" });

    teamup.status = status;
    await teamup.save();

    res.json({ message: `Team Up status updated to ${status}`, teamup });
  } catch (err) {
    console.error("Error updating team up status:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTeamUp = async (req, res) => {
  try {
    const { id } = req.params;

    const teamup = await TeamUp.findById(id);
    if(!teamup) return res.status(404).json({ message: "Team Up not found" });

    if(teamup.is_deleted) {
      return res.status(400).json({ message: "Team Up already deleted" });
    }

    teamup.is_deleted = true;
    await teamup.save();

    res.json({ message: "Team Up deleted successfully", teamup});
  } catch (err) {
    console.error("Error deleting team up:", err);
    res.status(500).json({ message: "Server error" });
  }
};