import { config } from "dotenv";
import { Sequelize } from "sequelize";
import jwtPkg from "jsonwebtoken";
import multer from "multer";
const { verify } = jwtPkg;
import nodemailer from "nodemailer";

import "pg";
import "pg-hstore";

config();

// const blobClient = createBlobClient(process.env.BLOB_READ_WRITE_TOKEN);

const database = new Sequelize(process.env.DB_URI, {
  dialect: "postgres",
  dialectOptions: {
    ssl: process.env.NODE_ENV === "production" && {
      required: true,
      rejectUnauthorized: false,
      ca: process.env.DB_CA,
    },
  },
  pool: {
    max: 10, // Maximum number of connections in the pool
    min: 0, // Minimum number of connections in the pool
    idle: 10000, // Connection idle time before release (in ms)
  },
  logging: false,
});

try {
  await database.authenticate();
  console.log("✅ Database connection has been established successfully.");
} catch (error) {
  console.error("❌ Unable to connect to the database:", error);
}

const authenticateUser = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token)
    return res.status(401).send({
      message: "Unauthorized request",
    });

  token = token.replace("Bearer ", "");

  try {
    let decoded = verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res.status(401).send({
        message: "Unauthorized request",
      });

    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send({
      message: "Unauthorized request",
    });
  }
};

const authenticateAdmin = (req, res, next) => {
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

const memoryStorage = multer.memoryStorage();
const memoryUpload = multer({ storage: memoryStorage });

 const transporter = nodemailer.createTransport({
   host: process.env.EMAIL_HOST,
   port: process.env.EMAIL_PORT,
   auth: {
     user: process.env.EMAIL_USER,
     pass: process.env.EMAIL_PASS,
   },
 });

export {
  database,
  authenticateUser,
  authenticateAdmin,
  memoryUpload,
  transporter,
};
