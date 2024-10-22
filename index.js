import express from "express";
import cors from "cors";
import { config } from "dotenv";
import router from "./router/router.js";

config();
const app = express();
const port = process.env.SERVER_PORT || 1030;

// middleware: piece of code that runs before a request
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));
app.use(router);

// make our app listen for request
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  // Server running on http://localhost:3400
});
