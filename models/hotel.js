import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Trip from "./trip.js"; // Import Trip model for association

const Hotel = sequelize.define("Hotel", {
  hotel_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  trip_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Trip, //  Reference to Trip table
      key: "trip_id",
    },
    onDelete: "CASCADE", // Delete hotels if the associated trip is deleted
  },
  hotel_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Hotel_image:{
    type: DataTypes.STRING,
    allowNull:false,
  },
});

// Define relationships
Trip.hasMany(Hotel, { foreignKey: "trip_id", onDelete: "CASCADE" });
Hotel.belongsTo(Trip, { foreignKey: "trip_id" });

sequelize.sync().then(()=>{
  console.log("hotel table created....");
}).catch(err=>{
  console.log("Failed to create hotel")
})

export default Hotel;
