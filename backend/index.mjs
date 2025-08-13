import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import adminRoutes from "./routes/admin.route.mjs";
import dbConnection from "./config/db.connection.mjs";
import User from "./models/User.mjs";


dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/admin", adminRoutes);

// Connect to MongoDB
dbConnection().then(async () => {
  const existingAdmin = await User.findOne({ email: "admin@example.com" });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({ email: "admin@example.com", password: hashedPassword, is_admin: true, is_varified: true });
    console.log("Default admin created");
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
