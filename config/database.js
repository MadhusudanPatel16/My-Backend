import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Sequelize with environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME,  // Database Name
  process.env.DB_USER,  // Database User
  process.env.DB_PASSWORD,  // Database Password
  {
    host: process.env.DB_HOST, // Database Host
    dialect: "mysql",
    logging: false, // Disable query logs (optional)
  }
);

// Function to authenticate DB connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(" Database connected successfully...");
  } catch (error) {
    console.error(" Database connection failed:", error.message);
    process.exit(1); // Exit process with failure
  }
};

// Run DB connection
connectDB();

// Export sequelize instance
export default sequelize;
