import express from "express";
import cors from "cors";
import { config } from "dotenv";
import router from "./router/router.js";
import adminRouter from "./router/admin/router.js";

config();
const app = express();
const port = process.env.SERVER_PORT || 1030;

// middleware: piece of code that runs before a request
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
    limit: "1gb",
  })
);
app.use(express.static("public"));
app.use(router);
app.use("/admin", adminRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
