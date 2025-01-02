import { DataTypes } from "sequelize";
import { database } from "../util/util.js";

/**
 * Course Model
 */
const Course = database.define("course", {
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
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: true,
    set(value) {
      if (this.getDataValue("isPaid"))
        this.setDataValue("price", value);
      else this.setDataValue("price", 1);
    },
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reviews: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thumbnailVideo: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
});

export default Course;
