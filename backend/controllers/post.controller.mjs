import Space from "../models/Space.mjs";
import { createSpaceSchema } from "../validations/space.validator.mjs";
import { fileHandler } from "../utils/fileHandler.mjs";

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
