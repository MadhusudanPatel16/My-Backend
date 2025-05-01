import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user.js";
import Trip from "./trip.js";
import Bus from "./bus.js";
import Hotel from "./hotel.js";
import PickupPoint from "./pickupPoint.js";

const UserTrip = sequelize.define("UserTrip", {
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
    onDelete: "CASCADE",
  },
  trip_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Trip,
      key: "trip_id",
    },
    onDelete: "CASCADE",
  },
  bus_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Bus,
      key: "bus_id",
    },
  },
  hotel_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Hotel,
      key: "hotel_id",
    },
  },
  pickup_point_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PickupPoint,
      key: "pickup_id",
    },
  },
});

User.hasMany(UserTrip, { foreignKey: "user_id" });
Trip.hasMany(UserTrip, { foreignKey: "trip_id" });
Bus.hasMany(UserTrip, { foreignKey: "bus_id" });
Hotel.hasMany(UserTrip, { foreignKey: "hotel_id" });
PickupPoint.hasMany(UserTrip, { foreignKey: "pickup_point_id" });

UserTrip.belongsTo(User, { foreignKey: "user_id" });
UserTrip.belongsTo(Trip, { foreignKey: "trip_id" });
UserTrip.belongsTo(Bus, { foreignKey: "bus_id" });
UserTrip.belongsTo(Hotel, { foreignKey: "hotel_id" });
UserTrip.belongsTo(PickupPoint, { foreignKey: "pickup_point_id" });

sequelize.sync()
  .then(() => console.log("UserTrip table created...."))
  .catch((err) => console.log("Failed to create UserTrip table", err));

export default UserTrip;
