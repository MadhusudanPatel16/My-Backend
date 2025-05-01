import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Trip from "./trip.js"; // Import Trip model for association

const Bus = sequelize.define("Bus", {
  bus_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  bus_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  seating_capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  driver_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Bus_image: {
    type: DataTypes.STRING,
    allowNull: false, // Ensure an image is required
  },
});

// Define relationships
Trip.hasMany(Bus, { foreignKey: "trip_id", onDelete: "CASCADE" });
Bus.belongsTo(Trip, { foreignKey: "trip_id" });

sequelize.sync()
  .then(() => console.log("Bus table created...."))
  .catch((err) => console.log("Failed to create bus", err));

export default Bus;
