import Space from "../models/Space.mjs";
import { createSpaceSchema } from "../validations/space.validator.mjs";
import { fileHandler } from "../utils/fileHandler.mjs";
import TeamUp from "../models/TeamUp.mjs";

//Spaces
export const createSpace = async (req, res) => {
  try {
    const { error } = createSpaceSchema.validate(req.body, { abortEarly: false });
    const errors = {};

    if (error) {
      error.details.forEach(err => {
        const key = err.path.join(".");
        if (!errors[key]) errors[key] = [];
        errors[key].push(err.message);
      });
    }

    if (!req.files?.featuredImage?.[0]) {
      errors.featuredImage = ["Featured image is required"];
    }

    if (Object.keys(errors).length > 0) {
      const firstErrorMessage = Object.values(errors)[0][0];
      const message = Object.keys(errors).length > 1
        ? `${firstErrorMessage} (and ${Object.keys(errors).length - 1} more errors)`
        : firstErrorMessage;

      return res.status(422).json({ message, errors });
    }

    const {
      title, propertyType, budget, budgetType, personalInfo, size,
      furnishing, smoking, roomsAvailableFor, bedrooms,
      country, state, city, location, description, amenities
    } = req.body;

    let featuredImagePath = "";
    if (req.files.featuredImage?.[0]) {
      fileHandler.validateExtension(req.files.featuredImage[0].originalname, "image");
      const saved = fileHandler.saveFile(req.files.featuredImage[0], "featured");
      featuredImagePath = saved.relativePath;
    }

    const photos = [];
    if (req.files.photos?.length) {
      req.files.photos.forEach(file => {
        fileHandler.validateExtension(file.originalname, "image");
        const saved = fileHandler.saveFile(file, "photos");
        photos.push({ id: Date.now() + Math.random(), url: saved.relativePath });
      });
    }

    const space = new Space({
      user: req.user._id,
      title,
      propertyType,
      budget,
      budgetType,
      personalInfo,
      size,
      furnishing: furnishing === "true",
      smoking: smoking === "true",
      roomsAvailableFor: roomsAvailableFor || req.body.rooms,
      bedrooms: Number(bedrooms),
      country,
      state,
      city,
      location,
      description,
      amenities,
      featuredImage: featuredImagePath,
      photos,
    });

    await space.save();

    res.status(201).json({ message: "Space posted successfully", space });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getSpaces = async (req, res) => {
  try {
    const {
      minValue,
      maxValue,
      priceType,
      minSize,
      maxSize,
      furnishing,
      smoking,
      propertyType,
      roomAvailable,
      bedrooms,
      moveInDate,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      status: "active",
      available: true,
      is_deleted: false,
    };

    if (minValue || maxValue) {
      query.budget = {};
      if (minValue) query.budget.$gte = Number(minValue);
      if (maxValue) query.budget.$lte = Number(maxValue);
    }

    if (priceType) query.budgetType = priceType;

    if (minSize || maxSize) {
      query.size = {};
      if (minSize) query.size.$gte = Number(minSize);
      if (maxSize) query.size.$lte = Number(maxSize);
    }

    if (furnishing && furnishing !== "all") {
      query.furnishing = furnishing === "furnished";
    }

    if (smoking && smoking !== "all") {
      query.smoking = smoking === "allowed";
    }

    if (propertyType && propertyType !== "all") {
      query.propertyType = propertyType;
    }

    if (roomAvailable && roomAvailable !== "any") {
      query.roomsAvailableFor = roomAvailable;
    }

    if (bedrooms && bedrooms !== "Any") {
      query.bedrooms = Number(bedrooms);
    }

    if (moveInDate) {
      query.availableFrom = { $lte: new Date(moveInDate) };
    }

    const skip = (page - 1) * limit;

    const spaces = await Space.find(query)
      .select("title postCategory propertyType budget budgetType personalInfo size furnishing smoking roomsAvailableFor bedrooms country state city description featuredImage status available is_deleted")
      .populate("user", "profile.firstName profile.lastName profile.photo")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Space.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: spaces,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSpaceById = async (req, res) => {
  try {
    const { id } = req.params;

    const space = await Space.findById(id)
      .populate("user", "profile.firstName profile.lastName profile.photo createdAt");

    if (!space) {
      return res.status(404).json({ success: false, message: "Space not found" });
    }

    res.status(200).json({
      success: true,
      data: space,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//TeampUp
export const createTeamUp = async (req, res) => {
  try {
    let uploadedPhotos = [];
    if (req.files && req.files.length > 0) {
      uploadedPhotos = req.files.map((file) => {
        fileHandler.validateExtension(file.originalname, "image");
        const savedFile = fileHandler.saveFile(file, "teamup");
        return {
          id: savedFile.fileName,
          url: savedFile.relativePath,
        };
      });
    }

    const TeampUpData = {
      ...req.body,
      photos: uploadedPhotos,
    };

    ["smoke", "pets", "petsPreference"].forEach((field) => {
      if (teamUpData[field] === "true") teamUpData[field] = true;
      if (teamUpData[field] === "false") teamUpData[field] = false;
    });

    const newPost = await TeamUp.create(teamUpData);

    return res.status(201).json({
      message: "TeamUp post created successfully",
      data: newPost,
    });
  } catch (error) {
    console.error("Create TeamUp error:", error);
    return res.status(500).json({
      message: "Failed to create TeamUp post",
      error: error.message,
    });
  }
};

