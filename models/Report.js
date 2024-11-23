import { DataTypes } from "sequelize";
import { database } from "../util/util.js";

const Report = database.define("report", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
});

export default Report;
