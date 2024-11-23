import express from "express";
import { config } from "dotenv";
import cors from "cors";
import router from "./router/users/router.js";
import adminRouter from "./router/admins/router.js";
import migrate from "./migrate.js";
import rateLimit from "express-rate-limit";

config();
const app = express();
const port = process.env.SERVER_PORT || 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})

app.use(limiter)
app.use(express.json());
app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: true,
    limit: "250mb"
  })
);
app.use(cors());
app.use((req, res, next) => {
  next();
  console.log(req.method, req.url);
});
app.use(router);
app.use("/admin", adminRouter);


await migrate();

app.listen(port, () => {
  console.log(`Server running on  http://localhost:${port}`);
});

