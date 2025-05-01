import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Admin from "./admin.js"; // Assuming you have an Admin model

const Trip = sequelize.define("Trip", {
  trip_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  admin_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Admin, // Reference to Admin table
      key: "admin_id",
    },
  },
  trip_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  nights: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  days: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  meals: {
    type: DataTypes.STRING,
  },
  Trip_price: {
    type: DataTypes.FLOAT,
    allowNull:false,
  },
  Trip_image:{
    type: DataTypes.STRING,
    allowNull:false,
  },
  nightcamping: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Define the association with Admin (One Admin can manage many trips)
Admin.hasMany(Trip, { foreignKey: "admin_id" });
Trip.belongsTo(Admin, { foreignKey: "admin_id" });

sequelize.sync().then(()=>{
  console.log("Trip table created....");
}).catch(err=>{
  console.log("Failed to create Trip")
})

export default Trip;
