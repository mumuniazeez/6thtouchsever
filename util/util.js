import { config } from "dotenv";
import pgPkg from "pg";
const { Pool } = pgPkg;
import multer from "multer";

import JWTPkg from "jsonwebtoken";
const { verify } = JWTPkg;

config();

// connect to our database
const db = new Pool({
  connectionString: process.env.DB_URL,
});

// listen for connection
db.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

db.on("connect", () => {
  console.log("Connected to database");
});

// authentication middleware
const userAuthorize = (req, res, next) => {
  // decode the jwt token and give us your information

  let { authorization } = req.headers;

  // if no authorization token
  if (!authorization)
    return res.status(401).json({
      message: "Unauthorized request",
    });

  try {
    // removing "Bearer " from authorization
    let token = authorization.replace("Bearer ", "");

    // decoding the token
    let decoded = verify(token, process.env.JWT_SECRET);

    // if no decoded
    if (!decoded)
      return res.status(401).json({
        message: "Unauthorized request",
      });

    // setting the req.user to the decoded data
    req.user = decoded;

    // going to the next request
    next();
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized request",
    });
  }
};

const adminAuthorize = (req, res, next) => {
  // decode the jwt token and give us your information

  let { authorization } = req.headers;

  // if no authorization token
  if (!authorization)
    return res.status(401).json({
      message: "Unauthorized request",
    });

  try {
    // removing "Bearer " from authorization
    let token = authorization.replace("Bearer ", "");

    // decoding the token
    let decoded = verify(token, process.env.JWT_SECRET);

    // if no decoded
    if (!decoded)
      return res.status(401).json({
        message: "Unauthorized request",
      });

    // setting the req.user to the decoded data
    req.admin = decoded;

    // going to the next request
    next();
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized request",
    });
  }
};

const thumbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/thumbnail");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const thumbnailUpload = multer({ storage: thumbnailStorage });

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/videos");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const videoUpload = multer({ storage: videoStorage });



export { db, userAuthorize, adminAuthorize, thumbnailUpload, videoUpload };
