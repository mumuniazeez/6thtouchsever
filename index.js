import express from "express";
import { config } from "dotenv";
import cors from "cors";
import userRouter from "./router/users/router.js";
import adminRouter from "./router/admins/router.js";
import migrate from "./migrate.js";
import rateLimit from "express-rate-limit";
import { handleUpload } from "@vercel/blob/client";
import { authenticateAdmin } from "./util/util.js";

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

if (process.env.NODE_ENV !== "development") app.use(limiter);
app.use(express.json());
app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: true,
    limit: "250mb",
  })
);
app.use((req, res, next) => {
  console.log(req.method, req.url);
  res.on("finish", () => {
    console.log(req.method, req.url, res.statusCode, res.statusMessage);
  });
  next();
});
app.use(cors());
app.use(userRouter);
app.use("/admin", adminRouter);

app.post("/admin/handleUpload", async (req, res) => {
  const { body } = req;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname /*, clientPayload */) => {
        return {
          allowedContentTypes: ["image/*", "video/*"],
          tokenPayload: JSON.stringify({}),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Get notified of client upload completion
        // ⚠️ This will not work on `localhost` websites,
        // Use ngrok or similar to get the full upload flow

        console.log("blob upload completed", blob, tokenPayload);

        try {
          // Run any logic after the file upload completed,
          // If you've already validated the user and authorization prior, you can
          // safely update your database
        } catch (error) {
          throw new Error("Could not update post");
        }
      },
    });

    return res.json(jsonResponse);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

await migrate();

app.listen(port, () => {
  console.log(`Server running on  http://localhost:${port}`);
});
