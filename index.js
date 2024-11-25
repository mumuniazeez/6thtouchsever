import express from "express";
import { config } from "dotenv";
import cors from "cors";
import userRouter from "./router/users/router.js";
import adminRouter from "./router/admins/router.js";
import migrate from "./migrate.js";
import rateLimit from "express-rate-limit";

config();
/**
 * Express app for server
 */
const app = express();
const port = process.env.SERVER_PORT || 3000;

/**
 * Request limiter, set requests to 100 request per 15 minute for each IP
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // limit each IP to 100 requests per windowMs
  message: {
    message: "Too many request from your device, try again later",
  },
});

app.use(limiter);
app.use(express.json());
app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: true,
    limit: "250mb",
  })
);
app.use(cors());
app.use((req, res, next) => {
  next();
  console.log(req.method, req.url);
});
app.use(userRouter);
app.use("/admin", adminRouter);

await migrate();

app.listen(port, () => {
  console.log(`Server running on  http://localhost:${port}`);
});
