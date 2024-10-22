import { config } from "dotenv";
import pgPkg from "pg";
const { Pool } = pgPkg;

import JWTPkg from "jsonwebtoken";
const { verify } = JWTPkg;

config();

// connect to our database
const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.crt
    ? {
        ca: process.env.crt,
      }
    : null,
});

// listen for connection
db.on("connect", () => console.log("Connected to database"));

db.on("error", (err) => console.log(err));

// authentication middleware
const authorize = (req, res, next) => {
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

export { db, authorize };
