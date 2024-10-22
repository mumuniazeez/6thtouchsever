import { db } from "../util/util.js";
import pkg from "bcrypt";
const { hash, compare } = pkg;
import JWTPkg from "jsonwebtoken";
const { sign } = JWTPkg;

export const signUp = async (req, res) => {
  try {
    let { firstname, lastname, email, password } = req.body;

    // hashing password
    password = await hash(password, 10);

    // insert data for database
    let query = `INSERT INTO users (firstname, lastname, email, password, id ) VALUES($1, $2, $3, $4, gen_random_uuid())`;
    let values = [firstname, lastname, email, password];
    let result = await db.query(query, values);

    // check if it was successful

    if (result.rowCount < 1)
      return res.status(401).json({
        message: "Error creating account",
      });

    res.status(201).json({
      message: "Account is created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Error creating account, this may be because the email is already been used",
    });
  }
};

export const logIn = async (req, res) => {
  try {
    let { email, password } = req.body;

    // get the user from the database using the email
    let query = `SELECT id, email, password FROM users WHERE email = $1`;
    let values = [email];
    let result = await db.query(query, values);

    let user = result.rows[0];
    // check if the user exist
    // if there no user
    if (!user)
      return res.status(401).json({
        message: "Unauthorize credentials",
      });

    // compare the passwords
    let isPasswordCorrect = await compare(password, user.password);

    // if password is not correct
    if (!isPasswordCorrect)
      return res.status(401).json({
        message: "Unauthorize credentials",
      });

    // sign jwt token
    let token = sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1day",
      }
    );
    // send token to the user

    res.status(200).json({
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error logging in",
    });
  }
};