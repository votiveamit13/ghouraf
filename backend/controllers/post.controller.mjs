import Space from "../models/Space.mjs";
import { createSpaceSchema } from "../validations/space.validator.mjs";
import { fileHandler } from "../utils/fileHandler.mjs";

export const createSpace = async (req, res) => {
    try {
        const { error } = createSpaceSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = {};
            error.details.forEach(err => {
                const key = err.path.join(".");
                if (!errors[key]) errors[key] = [];
                errors[key].push(err.message);
            });

            return res.status(422).json({
                message: error.details[0].message,
                errors,
            });
        }

        const {
            title,
            propertyType,
            budget,
            budgetType,
            personalInfo,
            size,
            furnishing,
            smoking,
            roomsAvailableFor,
            bedrooms,
            country,
            state,
            city,
            location,
            description,
            amenities,
        } = req.body;

        let featuredImagePath = "";
        if (req.files?.featuredImage?.[0]) {
            fileHandler.validateExtension(req.files.featuredImage[0].originalname, "image");
            const saved = fileHandler.saveFile(req.files.featuredImage[0], "featured");
            featuredImagePath = saved.relativePath;
        }

        const photos = [];
        if (req.files?.photos?.length > 0) {
            req.files.photos.forEach((file) => {
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
            furnishing: Boolean(Number(furnishing)),
            smoking: Boolean(Number(smoking)),
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

        res.status(201).json({
            message: "Space posted successfully",
            space,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};