import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import cors from "cors";
import adminRoutes from "./routes/admin.route.mjs";
import userRoutes from "./routes/user.route.mjs";
import dbConnection from "./config/db.connection.mjs";
import User from "./models/User.mjs";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";


dotenv.config();
const app = express();

app.use(cors());

app.use(helmet())
app.use(morgan('dev'))

app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/admin", adminRoutes);

app.use("/api", userRoutes);

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
