import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import cors from "cors";
import adminRoutes from "./routes/admin.route.mjs";
import userRoutes from "./routes/user.route.mjs";
import guestRoutes from "./routes/guest.route.mjs";
import postRoutes from "./routes/post.route.mjs";
import promotionRoutes from "./routes/promotion.routes.mjs";
import dbConnection from "./config/db.connection.mjs";
import User from "./models/User.mjs";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import stripeWebhook from "./routes/stripe.webhook.mjs";

dotenv.config();
const app = express();

app.set("trust proxy", 1);

app.use(cors());

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(morgan('dev'))

app.use("/api/stripe", stripeWebhook);
app.use("/api/stripe/webhooks/create-promotion-session", express.json());
app.use("/api/stripe/webhooks", express.raw({ type: "application/json" }), promotionRoutes);

app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/admin", adminRoutes);

app.use("/api", userRoutes, guestRoutes, postRoutes);

dbConnection().then(async () => {
  const existingAdmin = await User.findOne({ email: "admin@example.com" });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({ email: "admin@example.com", password: hashedPassword, isAdmin: true});
    console.log("Default admin created");
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
