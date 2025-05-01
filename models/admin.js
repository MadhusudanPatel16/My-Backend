import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Admin = sequelize.define("Admin", {
  admin_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate:{isEmail:true},
  },
  password: {
    type: DataTypes.STRING,  
    allowNull: false,
  },
});

sequelize.sync().then(()=>{
  console.log("Admin table created....");
}).catch(err=>{
  console.log("Failed to create admin")
})

export default Admin;
