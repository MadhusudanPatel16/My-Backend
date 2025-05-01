import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user.js";
import Trip from "./trip.js";

const Booking = sequelize.define("Booking", {
  booking_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
  },
  trip_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Trip,
      key: "trip_id",
    },
  },
});

// ✅ Associations
User.hasMany(Booking, { foreignKey: "user_id" });
Booking.belongsTo(User, { foreignKey: "user_id" });

Trip.hasMany(Booking, { foreignKey: "trip_id" });
Booking.belongsTo(Trip, { foreignKey: "trip_id" });

sequelize
  .sync()
  .then(() => {
    console.log("Booking table created....");
  })
  .catch((err) => {
    console.log("Failed to create Booking table", err);
  });

export default Booking;
