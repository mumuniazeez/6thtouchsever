import express from "express";
import { config } from "dotenv";
import cors from "cors";
import router from "./router/users/router.js";
import adminRouter from "./router/admins/router.js";
import { database } from "./util/util.js";

config();
const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(router);
app.use("/admin", adminRouter);

if (process.env.NODE_ENV === "production") await database.sync({ alter: true });

app.listen(port, () => {
  console.log(`Server running on  http://localhost:${port}`);
});
