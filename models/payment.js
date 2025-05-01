import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user.js";

const Payment = sequelize.define("Payment", {
  payment_id: {
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
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Pending", // Default status before confirmation
  },
});

// Associations
User.hasMany(Payment, { foreignKey: "user_id", onDelete: "CASCADE" });
Payment.belongsTo(User, { foreignKey: "user_id" });

sequelize.sync()
  .then(() => console.log("Payment table created..."))
  .catch(err => console.log("Failed to create Payment table"));

export default Payment;
