import Space from "../models/Space.mjs";
import { createSpaceSchema } from "../validations/space.validator.mjs";
import { fileHandler } from "../utils/fileHandler.mjs";
import TeamUp from "../models/TeamUp.mjs";
import SavedPost from "../models/SavedPost.mjs";
import { createSpaceWantedSchema } from "../validations/spacewanted.validator.mjs";
import SpaceWanted from "../models/SpaceWanted.mjs";
import SpaceTeamUps from "../models/SpaceTeamUps.mjs";
import Stripe from "stripe";
import Report from "../models/Report.mjs";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//Spaces
export const createSpace = async (req, res) => {
  try {
    const { error } = createSpaceSchema.validate(req.body, { abortEarly: false });
    const errors = {};

    if (error) {
      error.details.forEach((err) => {
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
      const message =
        Object.keys(errors).length > 1
          ? `${firstErrorMessage} (and ${Object.keys(errors).length - 1} more errors)`
          : firstErrorMessage;

      return res.status(422).json({ message, errors });
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
      promote,
      plan,
    } = req.body;

    let featuredImagePath = "";
    if (req.files.featuredImage?.[0]) {
      fileHandler.validateExtension(req.files.featuredImage[0].originalname, "image");
      const saved = fileHandler.saveFile(req.files.featuredImage[0], "featured");
      featuredImagePath = saved.relativePath;
    }

    const photos = [];
    if (req.files.photos?.length) {
      req.files.photos.forEach((file) => {
        fileHandler.validateExtension(file.originalname, "image");
        const saved = fileHandler.saveFile(file, "photos");
        photos.push({ id: Date.now() + Math.random(), url: saved.relativePath });
      });
    }

    let processedAmenities = [];
    if (Array.isArray(amenities)) {
      processedAmenities = amenities;
    } else if (typeof amenities === 'string') {
      processedAmenities = amenities.split(',').filter(a => a.trim());
    }

    const spaceData = {
      title,
      propertyType,
      budget: Number(budget),
      budgetType,
      personalInfo,
      size: Number(size),
      furnishing: furnishing === "true",
      smoking: smoking === "true",
      roomsAvailableFor: roomsAvailableFor || req.body.rooms,
      bedrooms: Number(bedrooms),
      country,
      state,
      city,
      location,
      description,
      amenities: processedAmenities,
      featuredImage: featuredImagePath,
      photos,
    };

    if (promote === "true") {
      const planPrices = {
        "10_days": 15,
        "30_days": 20,
      };

      const amountUSD = planPrices[plan];
      if (!amountUSD) {
        return res.status(400).json({ message: "Invalid promotion plan" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountUSD * 100,
        currency: "usd",
        metadata: {
          userId: req.user._id.toString(),
          plan,
          spaceData: JSON.stringify(spaceData),
        },
      });

      return res.status(200).json({
        message: "Promotion payment initiated",
        clientSecret: paymentIntent.client_secret,
        promotionInfo: { plan, amountUSD },
      });
    }

    const space = new Space({
      user: req.user._id,
      ...spaceData,
      promotion: { isPromoted: false, paymentStatus: "pending" },
    });

    await space.save();
    res.status(201).json({ message: "Space posted successfully", space });
  } catch (err) {
    console.error("Error creating space:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const { userId, plan, spaceData } = paymentIntent.metadata;

    try {
      const parsedData = JSON.parse(spaceData);

      const days = plan === "30_days" ? 30 : 10;
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + days);

      const space = new Space({
        user: userId,
        ...parsedData,
        promotion: {
          isPromoted: true,
          plan,
          amountUSD: paymentIntent.amount / 100,
          paymentStatus: "success",
          paymentId: paymentIntent.id,
          startDate,
          endDate,
        },
        status: "inactive",
      });

      await space.save();
      console.log("Promoted space created successfully after payment");
    } catch (error) {
      console.error("Error creating promoted space:", error);
    }
  }

  res.json({ received: true });
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

    await Space.updateMany(
      { "promotion.isPromoted": true, "promotion.endDate": { $lt: new Date() } },
      {
        $set: {
          "promotion.isPromoted": false,
          "promotion.plan": null,
          "promotion.amountUSD": 0,
          "promotion.paymentStatus": "expired"
        }
      }
    );


    let sortOption = {};

    if (sortBy === "Lowest First") {
      sortOption = { budget: 1 };
    } else if (sortBy === "Highest First") {
      sortOption = { budget: -1 };
    } else {
      sortOption = {
        "promotion.isPromoted": -1,
        "promotion.startDate": 1,
        createdAt: -1,
      };
    }

    // if (moveInDate) {
    //   query.availableFrom = { $lte: new Date(moveInDate) };
    // }

    const skip = (page - 1) * limit;

    const spaces = await Space.find(query)
      .select("title postCategory propertyType budget budgetType personalInfo amenities size furnishing smoking roomsAvailableFor bedrooms country state city description featuredImage status available is_deleted promotion")
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

export const requestTeamUp = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    let existing = await SpaceTeamUps.findOne({ postId: id, userId });
    if (existing)
      return res.status(400).json({ success: false, message: "You have already requested to team up." });

    const teamUp = await SpaceTeamUps.create({ postId: id, userId, interested: true });
    res.json({ success: true, data: teamUp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getSpaceTeamUps = async (req, res) => {
  try {
    const { id } = req.params;
    const teamUps = await SpaceTeamUps.find({ postId: id, interested: true })
      .populate("userId", "profile email");

    res.json({ success: true, data: teamUps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const removeTeamUp = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const removed = await SpaceTeamUps.findOneAndDelete({ postId: id, userId });

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: "You have not requested to team up on this post.",
      });
    }

    res.json({
      success: true,
      message: "Removed successfully.",
    });
  } catch (err) {
    console.error("Error removing team up:", err);
    res.status(500).json({ success: false, message: "Server Error" });
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
      // roommatePref,
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

    // if (roommatePref && roommatePref !== "any") {
    //   query.roommatePref = roommatePref;
    // }

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

    await TeamUp.updateMany(
      { "promotion.isPromoted": true, "promotion.endDate": { $lt: new Date() } },
      {
        $set: {
          "promotion.isPromoted": false,
          "promotion.plan": null,
          "promotion.amountUSD": 0,
          "promotion.paymentStatus": "expired",
        },
      }
    );

    await SpaceWanted.updateMany(
      { "promotion.isPromoted": true, "promotion.endDate": { $lt: new Date() } },
      {
        $set: {
          "promotion.isPromoted": false,
          "promotion.plan": null,
          "promotion.amountUSD": 0,
          "promotion.paymentStatus": "expired",
        },
      }
    );

    // const skip = (page - 1) * limit;

    const teamUps = await TeamUp.find(query)
      .select(
        "title postCategory budget budgetType smoke description amenities moveInDate country state city photos status available is_deleted occupation createdAt promotion"
      )
      .populate("user", "profile.firstName profile.lastName profile.photo")


    const spaceWantedTeamUps = await SpaceWanted.find({
      ...query,
      teamUp: true,
    })

      .select(
        "title postCategory budget budgetType smoke description amenities moveInDate country state city photos status available is_deleted occupation createdAt promotion"
      )
      .populate("user", "profile.firstName profile.lastName profile.photo");

    let allTeamUps = [...teamUps, ...spaceWantedTeamUps];

    if (sortBy === "Lowest First") {
      allTeamUps.sort((a, b) => a.budget - b.budget);
    } else if (sortBy === "Highest First") {
      allTeamUps.sort((a, b) => b.budget - a.budget);
    } else {
      allTeamUps.sort((a, b) => {
        if (a.promotion?.isPromoted && !b.promotion?.isPromoted) return -1;
        if (!a.promotion?.isPromoted && b.promotion?.isPromoted) return 1;

        if (
          a.promotion?.isPromoted &&
          b.promotion?.isPromoted &&
          a.promotion.startDate &&
          b.promotion.startDate
        ) {
          return new Date(a.promotion.startDate) - new Date(b.promotion.startDate);
        }

        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }

    const total = allTeamUps.length;
    const skip = (page - 1) * limit;
    const paginated = allTeamUps.slice(skip, skip + Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: paginated,
    });
  } catch (error) {
    console.error("Get TeamUps error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeamUpById = async (req, res) => {
  try {
    const { id } = req.params;

    let data = await TeamUp.findById(id)
      .populate("user", "profile.firstName profile.lastName profile.photo createdAt");

    if (!data) {
      data = await SpaceWanted.findById(id)
        .populate("user", "profile.firstName profile.lastName profile.photo createdAt");
    }

    if (!data) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching TeamUp:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//SavedPost
export const toggleSavePost = async (req, res) => {
  try {
    const userId = req.user._id;
    let { postId, postCategory, listingPage } = req.body;

    if (!postId || !postCategory || !listingPage) {
      return res.status(400).json({ message: "postId, postCategory and listingPage are required" });
    }

    let Model;
    switch (postCategory) {
      case "Space":
        Model = Space;
        break;
      case "Teamup":
        Model = TeamUp;
        break;
      case "Spacewanted":
        Model = SpaceWanted;
        break;
      default:
        return res.status(400).json({ message: "Invalid postCategory" });
    }

    const post = await Model.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    let effectiveCategory = listingPage;
    if (listingPage === "Teamup" && postCategory === "Spacewanted" && post.teamUp === true) {
      effectiveCategory = "Teamup";
    }

    const existing = await SavedPost.findOne({
      user: userId,
      postId,
      postCategory: effectiveCategory,
    });

    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({ message: "Removed from saved", saved: false });
    }

    let snapshot;
    if (effectiveCategory === "Space") {
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
        photo: post.featuredImage,
      };
    } else {
      snapshot = {
        title: post.title,
        country: post.country,
        state: post.state,
        city: post.city,
        roommatePref: post.roommatePref,
        budget: post.budget,
        budgetType: post.budgetType,
        description: post.description,
        photo: post.photos,
      };
    }

    const savedPost = new SavedPost({
      user: userId,
      postCategory: effectiveCategory,
      postId,
      snapshot,
    });

    await savedPost.save();
    return res.status(201).json({ message: "Saved successfully", saved: true });

  } catch (err) {
    console.error("Toggle Save Post Error:", err);
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

    const baseFilter = { user: userId, is_deleted: false };

    if (search) {
      const searchRegex = new RegExp(search, "i");
      baseFilter.$or = [{ title: searchRegex }, { city: searchRegex }];
    }

    let sortOption = { createdAt: -1 };
    if (sort === "Oldest First") sortOption = { createdAt: 1 };

    const spaceFilter = { ...baseFilter };
    const teamUpFilter = { ...baseFilter };
    const spaceWantedFilter = { ...baseFilter };

    if (category !== "All Category") {
      if (category === "Space") {
        teamUpFilter._skip = true;
        spaceWantedFilter._skip = true;
      } else if (category === "Spacewanted") {
        spaceFilter._skip = true;
        teamUpFilter._skip = true;
      } else if (category === "Teamup") {
        spaceFilter._skip = true;
        spaceWantedFilter._skip = true;
      }
    }

    const [spaces, teamUps, spaceWanteds] = await Promise.all([
      spaceFilter._skip ? [] : Space.find(spaceFilter).sort(sortOption),
      teamUpFilter._skip ? [] : TeamUp.find(teamUpFilter).sort(sortOption),
      spaceWantedFilter._skip ? [] : SpaceWanted.find(spaceWantedFilter).sort(sortOption),
    ]);

    let combined = [...spaces, ...teamUps, ...spaceWanteds];

    combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const totalCount = combined.length;
    const paginated = combined.slice(skip, skip + Number(limit));
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      data: paginated,
      totalCount,
      currentPage: Number(page),
      totalPages,
    });
  } catch (error) {
    console.error("getMyAds error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateAd = async (req, res) => {
  try {
    const { id } = req.params;
    const { postCategory } = req.body;
    let Model;

    switch (postCategory) {
      case "Space":
        Model = Space;
        break;
      case "Spacewanted":
        Model = SpaceWanted;
        break;
      case "Teamup":
        Model = TeamUp;
        break;
      default:
        return res.status(400).json({ message: "Invalid post category" });
    }

    const updatedData = { ...req.body };

    if (postCategory === "Space") {
      if (req.files?.featuredImage?.[0]) {
        fileHandler.validateExtension(req.files.featuredImage[0].originalname, "image");
        const saved = fileHandler.saveFile(req.files.featuredImage[0], "featured");
        updatedData.featuredImage = saved.relativePath;
      } else if (req.body.existingFeaturedImage) {
        updatedData.featuredImage = req.body.existingFeaturedImage;
      }
    }

    if (req.files?.photos && req.files.photos.length > 0) {
      const newPhotos = req.files.photos.map(file => {
        fileHandler.validateExtension(file.originalname, "image");
        const saved = fileHandler.saveFile(file, "photos");
        return {
          id: Date.now() + Math.random(),
          url: saved.relativePath
        };
      });

      if (req.body.existingPhotos) {
        const existingPhotos = Array.isArray(req.body.existingPhotos)
          ? req.body.existingPhotos.map(url => ({ id: Date.now() + Math.random(), url }))
          : [{ id: Date.now() + Math.random(), url: req.body.existingPhotos }];
        updatedData.photos = [...existingPhotos, ...newPhotos];
      } else {
        updatedData.photos = newPhotos;
      }
    } else if (req.body.existingPhotos) {
      updatedData.photos = Array.isArray(req.body.existingPhotos)
        ? req.body.existingPhotos.map(url => ({ id: Date.now() + Math.random(), url }))
        : [{ id: Date.now() + Math.random(), url: req.body.existingPhotos }];
    }

    if (postCategory === "Space") {
      updatedData.furnishing = updatedData.furnishing === "true";
      updatedData.smoking = updatedData.smoking === "true";
      updatedData.bedrooms = Number(updatedData.bedrooms);
      updatedData.budget = parseFloat(updatedData.budget);
      updatedData.size = parseFloat(updatedData.size);
    }

    if (postCategory === "Spacewanted") {
      updatedData.age = Number(updatedData.age);
      updatedData.budget = parseFloat(updatedData.budget);
      updatedData.roomSize = parseFloat(updatedData.roomSize);
    }

    if (postCategory === "Teamup") {
      updatedData.age = Number(updatedData.age);
      updatedData.budget = parseFloat(updatedData.budget);
      updatedData.minAge = updatedData.minAge ? Number(updatedData.minAge) : null;
      updatedData.maxAge = updatedData.maxAge ? Number(updatedData.maxAge) : null;
      updatedData.smoke = updatedData.smoke === "true";
      updatedData.pets = updatedData.pets === "true";
      updatedData.petsPreference = updatedData.petsPreference === "true";
    }

    const updatedAd = await Model.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    });

    if (!updatedAd) {
      return res.status(404).json({ message: "Ad not found" });
    }

    res.json({
      message: `${postCategory} ad updated successfully`,
      data: updatedAd,
    });
  } catch (error) {
    console.error("Error updating ad:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateAdAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { available } = req.body;

    if (typeof available !== "boolean") {
      return res.status(400).json({ message: "Invalid status value." });
    }

    let updatedAd = null;

    const models = [Space, SpaceWanted, TeamUp];
    for (const Model of models) {
      updatedAd = await Model.findByIdAndUpdate(
        id,
        { available },
        { new: true }
      );
      if (updatedAd) break;
    }

    if (!updatedAd) {
      return res.status(404).json({ message: "Ad not found." });
    }

    res.json({
      success: true,
      message: `Status ${available ? "Available" : "Unavailable"}`,
      data: updatedAd,
    });
  } catch (error) {
    console.error("Error updating ad status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteAd = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_deleted = true } = req.body;

    let deletedAd = null;

    const models = [Space, SpaceWanted, TeamUp];
    for (const Model of models) {
      deletedAd = await Model.findByIdAndUpdate(
        id,
        { is_deleted },
        { new: true }
      );
      if (deletedAd) break;
    }

    if (!deletedAd) {
      return res.status(404).json({ message: "Ad not found." });
    }

    res.json({
      success: true,
      message: is_deleted ? "Ad deleted successfully" : "Ad restored successfully",
      data: deletedAd,
    });
  } catch (error) {
    console.error("Error deleting ad:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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
      // roommatePref,
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

    // if (roommatePref && roommatePref !== "any") {
    //   query.roommatePref = roommatePref;
    // }

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

    await SpaceWanted.updateMany(
      { "promotion.isPromoted": true, "promotion.endDate": { $lt: new Date() } },
      {
        $set: {
          "promotion.isPromoted": false,
          "promotion.plan": null,
          "promotion.amountUSD": 0,
          "promotion.paymentStatus": "expired"
        }
      }
    );


    let sortOption = {};

    if (sortBy === "Lowest First") {
      sortOption = { budget: 1 };
    } else if (sortBy === "Highest First") {
      sortOption = { budget: -1 };
    } else {
      sortOption = {
        "promotion.isPromoted": -1,
        "promotion.startDate": 1,
        createdAt: -1,
      };
    }

    const skip = (page - 1) * limit;

    const spaceWanted = await SpaceWanted.find(query)
      .select(
        "title postCategory budget budgetType propertyType description amenities roomSize occupation age period country state city photos status available is_deleted"
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

export const getSpaceWantedById = async (req, res) => {
  try {
    const { id } = req.params;

    const spacewanted = await SpaceWanted.findById(id)
      .populate("user", "profile.firstName profile.lastName profile.photo createdAt");

    if (!spacewanted) {
      return res.status(404).json({ success: false, message: "Space Wanted not found" });
    }

    res.status(200).json({
      success: true,
      data: spacewanted,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Report
const modelMap = {
  Space,
  Spacewanted: SpaceWanted,
  Teamup: TeamUp,
};

const typeMap = {
  Space: "Space",
  Spacewanted: "SpaceWanted",
  Teamup: "TeamUp",
};

export const createReport = async (req, res) => {
  try {
    const { postId, postType, title, reason } = req.body;
    const userId = req.user?._id;

    if (!postId || !postType || !title || !reason)
      return res.status(400).json({ message: "All fields are required" });

    const Model = modelMap[postType];
    if (!Model) return res.status(400).json({ message: "Invalid post type" });

    const post = await Model.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const existing = await Report.findOne({ postId, userId });
    if (existing)
      return res
        .status(400)
        .json({ message: "You have already reported this post" });

    const report = await Report.create({
      postId,
      postType: typeMap[postType],
      userId,
      title,
      reason,
    });

    post.reportsCount = (post.reportsCount || 0) + 1;
    await post.save();

    res.status(201).json({
      message: "Report submitted successfully",
      report,
    });
  } catch (err) {
    console.error("Error creating report:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


