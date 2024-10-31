import { db } from "../../util/util.js";
import pkg from "bcrypt";
const { hash, compare } = pkg;
import JWTPkg from "jsonwebtoken";
const { sign } = JWTPkg;

export const addAdmin = async (req, res) => {
  try {
    let { firstname, lastname, email, password } = req.body;

    // hashing password
    password = await hash(password, 10);

    // insert data for database
    let query = `INSERT INTO admin (firstname, lastname, email, password, id ) VALUES($1, $2, $3, $4, gen_random_uuid())`;
    let values = [firstname, lastname, email, password];
    let result = await db.query(query, values);

    // check if it was successful

    if (result.rowCount < 1)
      return res.status(401).json({
        message: "Error adding admin",
      });

    res.status(201).json({
      message: "Admin is added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Error creating adding, this may be because the admin already exist",
    });
  }
};

export const adminLogIn = async (req, res) => {
  try {
    let { adminEmail, adminPassword } = req.body;

    // get the admin from the database using the email
    let query = `SELECT id, email, password FROM admin WHERE email = $1`;
    let values = [adminEmail];
    let result = await db.query(query, values);
    let admin = result.rows[0];
    // check if the user exist
    // if there no user
    if (!admin)
      return res.status(401).json({
        message: "Unauthorize credentials",
      });

    // compare the passwords
    let isPasswordCorrect = await compare(adminPassword, admin.password);

    // if password is not correct
    if (!isPasswordCorrect)
      return res.status(401).json({
        message: "Unauthorize credentials",
      });

    // sign jwt token
    let adminToken = sign(
      {
        id: admin.id,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1day",
      }
    );
    // send token to the user

    res.status(200).json({
      adminToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error logging in",
    });
  }
};
