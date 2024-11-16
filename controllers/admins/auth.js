import { compareSync } from "bcrypt";
import jwtPkg from "jsonwebtoken";
const { sign } = jwtPkg;
import Admins from "../../models/admins.js";

export const addAdmin = async (req, res) => {
  try {
    let { firstName, lastName, email, password } = req.body;

    // insert data for database
    let admin = await Admins.create({
      firstName,
      lastName,
      email,
      password,
    });

    // check if it was successful
    if (!admin)
      return res.status(400).json({
        message: "Error creating account",
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

    let admin = await Admins.findOne({
      where: {
        email: adminEmail,
      },
    });

    // check if the admin exist
    // if there no admin
    if (!admin)
      return res.status(401).json({
        message: "Unauthorize credentials",
      });

    // compare the passwords
    let isPasswordCorrect = compareSync(adminPassword, admin.password);

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
