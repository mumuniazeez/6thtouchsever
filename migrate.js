import Course from "./models/Course.js";
import Topic from "./models/Topic.js";
import Report from "./models/Report.js";
import User from "./models/User.js";
import Payment from "./models/Payment.js";
import { database } from "./util/util.js";

// script.js
const args = process.argv.slice(2); // Get all arguments after the first two

const flags = {};
args.forEach((arg) => {
  const [key, value] = arg.split("=");
  if (value) {
    flags[key.replace("--", "")] = value;
  } else {
    flags[key.replace("--", "")] = true; // Flag without value
  }
});

/**
 * Migrate all models to the database.
 * 
 * If your models have associations create them in this function.
 * Example:
 * ```javascript 
 *  // User-Report relation
    User.hasMany(Report, {
      onDelete: "SET NULL",
      onUpdate: "NO ACTION",
    });
    Report.belongsTo(User);
 * ```
 * 
 * To run function from CLI run `node migrate --development`
 */
const migrate = async () => {
  // User-Report relation
  User.hasMany(Report, {
    onDelete: "SET NULL",
    onUpdate: "NO ACTION",
  });
  Report.belongsTo(User);

  // Course-Topic relation
  Course.hasMany(Topic, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  });
  Topic.belongsTo(Course);

  Course.belongsToMany(User, {
    through: "userCourses",
    as: "subscribers",
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  });
  User.belongsToMany(Course, {
    through: "userCourses",
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  });

  Topic.belongsToMany(User, {
    through: "userProgress",
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  });

  User.belongsToMany(Topic, {
    through: "userProgress",
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  });

  Course.hasMany(Payment, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  });
  Payment.belongsTo(Course);

  User.hasMany(Payment, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  });
  Payment.belongsTo(User);

  await database.sync({ alter: true });

  console.log("\n✅ All model synced");
};

if (flags.development) await migrate();

export default migrate;
