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

migrate();

export default migrate;
