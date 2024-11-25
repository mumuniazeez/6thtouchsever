import { database } from "../util/util.js";
import { DataTypes } from "sequelize";

/**
 * Topic Model
 */
const Topic = database.define("topic", {
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
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  note: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  video: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Topic;
