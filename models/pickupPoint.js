import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Trip from "./trip.js"; // Import Trip model for association

const PickupPoint = sequelize.define("PickupPoint", {
  pickup_point_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  trip_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Trip, // Reference to the Trip table
      key: "trip_id",
    },
    onDelete: "CASCADE", // Delete pickup points if the trip is deleted
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  time: {
    type: DataTypes.STRING, // Keeping as STRING for flexibility (HH:MM format)
    allowNull: false,
  },
});

// Define relationships
Trip.hasMany(PickupPoint, { foreignKey: "trip_id", onDelete: "CASCADE" });
PickupPoint.belongsTo(Trip, { foreignKey: "trip_id" });

sequelize.sync().then(()=>{
  console.log("pickup table created....");
}).catch(err=>{
  console.log("Failed to create pickup")
})

export default PickupPoint;
