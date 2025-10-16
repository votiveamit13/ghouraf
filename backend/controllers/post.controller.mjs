import Space from "../models/Space.mjs";
import { createSpaceSchema } from "../validations/space.validator.mjs";
import { fileHandler } from "../utils/fileHandler.mjs";
import TeamUp from "../models/TeamUp.mjs";
import SavedPost from "../models/SavedPost.mjs";
import { createSpaceWantedSchema } from "../validations/spacewanted.validator.mjs";
import SpaceWanted from "../models/SpaceWanted.mjs";

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
      location,
      adPostedBy,
      amenities,
      sortBy,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      status: "active",
      available: true,
      is_deleted: false,
    };

    if (req.query.city) query.city = req.query.city;
    if (req.query.state) query.state = req.query.state;
    if (req.query.country) query.country = req.query.country;


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

    if (adPostedBy && adPostedBy !== "all") {
      query.personalInfo = adPostedBy;
    }

    if (req.query.amenities) {
      const amenities = req.query.amenities.split(',');
      query.amenities = { $all: amenities };
    }

        let sortOption = { createdAt: -1 }; 
    if (sortBy === "Lowest First") sortOption = { budget: 1 };
    if (sortBy === "Highest First") sortOption = { budget: -1 };

    // if (moveInDate) {
    //   query.availableFrom = { $lte: new Date(moveInDate) };
    // }

    const skip = (page - 1) * limit;

    const spaces = await Space.find(query)
      .select("title postCategory propertyType budget budgetType personalInfo amenities size furnishing smoking roomsAvailableFor bedrooms country state city description featuredImage status available is_deleted")
      .populate("user", "profile.firstName profile.lastName profile.photo")
      .sort(sortOption)
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

    const teamUpData = {
      ...req.body,
      user: req.user._id,
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

export const getTeamUps = async (req, res) => {
  try {
    const {
      minValue,
      maxValue,
      priceType,
      period,
      smoking,
      roommatePref,
      occupationPreference,
      minAge,
      maxAge,
      amenities,
      location,
      sortBy,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      status: "active",
      available: true,
      is_deleted: false,
    };

    if (req.query.city) query.city = req.query.city;
    if (req.query.state) query.state = req.query.state;
    if (req.query.country) query.country = req.query.country;

    if (minValue || maxValue) {
      query.budget = {};
      if (minValue) query.budget.$gte = Number(minValue);
      if (maxValue) query.budget.$lte = Number(maxValue);
    }

    if (priceType) query.budgetType = priceType;

    if (smoking && smoking !== "all") {
      query.smoke = smoking === "allowed";
    }

    if (roommatePref && roommatePref !== "any") {
      query.roommatePref = roommatePref;
    }

    if (period) {
      query.period = period;
    }

    if (occupationPreference && occupationPreference !== "all") {
      query.occupationPreference = occupationPreference;
    }

    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = Number(minAge);
      if (maxAge) query.age.$lte = Number(maxAge);
    }

    if (amenities) {
      const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities];
      query.amenities = { $all: amenitiesArray };
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === "Lowest First") sortOption = { budget: 1 };
    if (sortBy === "Highest First") sortOption = { budget: -1 };

    const skip = (page - 1) * limit;

    const teamUps = await TeamUp.find(query)
      .select(
        "title postCategory budget budgetType smoke roommatePref description amenities moveInDate country state city photos status available is_deleted occupation"
      )
      .populate("user", "profile.firstName profile.lastName profile.photo")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await TeamUp.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: teamUps,
    });
  } catch (error) {
    console.error("Get TeamUps error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeamUpById = async (req, res) => {
  try {
    const { id } = req.params;

    const teamup = await TeamUp.findById(id)
      .populate("user", "profile.firstName profile.lastName profile.photo createdAt");

    if (!teamup) {
      return res.status(404).json({ success: false, message: "Team Up not found" });
    }

    res.status(200).json({
      success: true,
      data: teamup,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//SavedPost
export const toggleSavePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId, postCategory } = req.body;

    if (!postId || !postCategory) {
      return res.status(400).json({ message: "postId and postCategory are required" });
    }

    const existing = await SavedPost.findOne({ user: userId, postId, postCategory });
    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({ message: "Removed from saved", saved: false });
    }

    let Model;
    switch (postCategory) {
      case "Space": Model = Space; break;
      case "Teamup": Model = TeamUp; break;
      case "Spacewanted": Model = SpaceWanted; break;
      default: return res.status(400).json({ message: "Invalid postCategory" });
    }

    const post = await Model.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    let snapshot;
    if (postCategory === "Space") {
      snapshot = {
        title: post.title,
        country: post.country,
        state: post.state,
        city: post.city,
        bedrooms: post.bedrooms,
        propertyType: post.propertyType,
        available: post.available,
        budget: post.budget,
        budgetType: post.budgetType,
        description: post.description,
        photo: post.featuredImage
      };
    } else if (postCategory === "Teamup") {
      snapshot = {
        title: post.title,
        country: post.country,
        state: post.state,
        city: post.city,
        roommatePref: post.roommatePref,
        budget: post.budget,
        budgetType: post.budgetType,
        description: post.description,
        photo: post.photos
      };
    } else {
      snapshot = { title: post.title, description: post.description };
    }

    const savedPost = new SavedPost({ user: userId, postCategory, postId, snapshot });
    await savedPost.save();

    return res.status(201).json({ message: "Saved successfully", saved: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getSavedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postCategory } = req.query;

    const query = { user: userId };
    if (postCategory) query.postCategory = postCategory;

    const savedPosts = await SavedPost.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ data: savedPosts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

//MyAds
export const getMyAds = async (req, res) => {
  try {
    const userId = req.user?._id;

    const {
      page = 1,
      limit = 9,
      category = "All Category",
      search = "",
      sort = "Recently posted",
    } = req.query;

    const skip = (page - 1) * limit;

    const spaceFilter = { user: userId, is_deleted: false };
    const teamUpFilter = { user: userId, is_deleted: false };

    if (search) {
      const searchRegex = new RegExp(search, "i");
      spaceFilter.$or = [{ title: searchRegex }, { location: searchRegex }];
      teamUpFilter.$or = [{ title: searchRegex }, { city: searchRegex }];
    }

    let sortOption = { createdAt: -1 };
    if (sort === "Oldest First") sortOption = { createdAt: 1 };
    else if (sort === "Newest First") sortOption = { createdAt: -1 };

    if (category !== "All Category") {
      if (category === "Space" || category === "Spacewanted") {
        spaceFilter.postCategory = category;
        teamUpFilter._skip = true; 
      } else if (category === "Teamup") {
        teamUpFilter.postCategory = category;
        spaceFilter._skip = true; 
      }
    }

    const [spaces, teamUps] = await Promise.all([
      spaceFilter._skip ? [] : Space.find(spaceFilter).sort(sortOption).skip(Number(skip)).limit(Number(limit)),
      teamUpFilter._skip ? [] : TeamUp.find(teamUpFilter).sort(sortOption).skip(Number(skip)).limit(Number(limit)),
    ]);

    const combined = [...spaces, ...teamUps].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const totalCount = combined.length;
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      data: combined,
      totalCount,
      currentPage: Number(page),
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Space Wanted
export const createSpaceWanted = async (req, res) => {
  try {
    const { error } = createSpaceWantedSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ success: false, errors });
    }

    const { user } = req;
    const data = req.body;

    let photos = [];
    if (req.files && req.files.length > 0) {
      photos = req.files.map((file) => {
        try {
          fileHandler.validateExtension(file.originalname, "image");
          const saved = fileHandler.saveFile(file, "spacewanted");
          return { id: Date.now().toString(), url: saved.relativePath };
        } catch (err) {
          throw new Error(`File upload failed: ${err.message}`);
        }
      });
    }

    const newPost = new SpaceWanted({
      ...data,
      user: req.user._id,
      photos,
    });

    await newPost.save();

    return res.status(201).json({
      success: true,
      message: "SpaceWanted post created successfully",
      data: newPost,
    });
  } catch (err) {
    console.error("❌ Error creating SpaceWanted:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

export const getSpaceWanted = async (req, res) => {
  try {
    const {
      minValue,
      maxValue,
      priceType,
      propertyType,
      period,
      minSize,
      maxSize,
      roommatePref,
      occupation,
      minAge,
      maxAge,
      amenities,
      location,
      sortBy,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      status: "active",
      available: true,
      is_deleted: false,
    };

    if (req.query.city) query.city = req.query.city;
    if (req.query.state) query.state = req.query.state;
    if (req.query.country) query.country = req.query.country;

    if (minValue || maxValue) {
      query.budget = {};
      if (minValue) query.budget.$gte = Number(minValue);
      if (maxValue) query.budget.$lte = Number(maxValue);
    }

    if (priceType) query.budgetType = priceType;

    if (propertyType && propertyType !== "all") {
      query.propertyType = propertyType;
    }

    if (period) {
      query.period = period;
    }

    if (minSize || maxSize) {
      query.roomSize = {};
      if (minSize) query.roomSize.$gte = Number(minSize);
      if (maxSize) query.roomSize.$lte = Number(maxSize);
    }

    if (roommatePref && roommatePref !== "any") {
      query.roommatePref = roommatePref;
    }

    if (occupation && occupation !== "all") {
      query.occupation = occupation;
    }

    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = Number(minAge);
      if (maxAge) query.age.$lte = Number(maxAge);
    }

    if (amenities) {
      const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities];
      query.amenities = { $all: amenitiesArray };
    }


    let sortOption = { createdAt: -1 }; 
    if (sortBy === "Lowest First") sortOption = { budget: 1 };
    if (sortBy === "Highest First") sortOption = { budget: -1 };

    const skip = (page - 1) * limit;

    const spaceWanted = await SpaceWanted.find(query)
      .select(
        "title postCategory budget budgetType propertyType description amenities roomSize roommatePref occupation age period country state city photos status available is_deleted"
      )
      .populate("user", "profile.firstName profile.lastName profile.photo")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await SpaceWanted.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: spaceWanted,
    });
  } catch (error) {
    console.error("Get SpaceWanted error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


