import Course from "./models/Course.js";
import Topic from "./models/Topic.js";
import Report from "./models/Report.js";
import User from "./models/User.js";
import { database } from "./util/util.js";

const migrate = async () => {
  User.hasMany(Report, {
    onDelete: "SET NULL",
    onUpdate: "NO ACTION",
  });
  Report.belongsTo(User);

  Course.hasMany(Topic, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  });
  Topic.belongsTo(Course);

  await database.sync({ alter: true });

  console.log("\n✅ All model synced");
};

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

if (flags.development) await migrate();

export default migrate;
