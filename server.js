import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";

import adminRoutes from "./routes/adminRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import pickupPointRoutes from "./routes/pickupPointRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import bookeduser from "./routes/BookeduserRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js"
import sequelize from "./config/database.js";


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

app.use("/admin", adminRoutes);
app.use("/trip", tripRoutes);
app.use("/user", userRoutes);
app.use("/pickupPoint", pickupPointRoutes);
app.use("/bus", busRoutes);
app.use("/bookeduser", bookeduser);
app.use("/hotel", hotelRoutes);
app.use("/auth", authRoutes);
app.use("/bookings",bookingRoutes);

sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });


app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
