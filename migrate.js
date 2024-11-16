import Courses from "./models/courses.js";
import Topics from "./models/topics.js";
import { database } from "./util/util.js";

const migrate = async () => {
  Courses.hasMany(Topics, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  });
  Topics.belongsTo(Courses);

  await database.sync({ alter: true });
  console.log("\n✅ All model synced");

  process.exit();
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

console.log(flags);
if (flags.development) await migrate();

export default migrate;
