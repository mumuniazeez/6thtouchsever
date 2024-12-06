import { compareSync } from "bcrypt";
import jwtPkg from "jsonwebtoken";
const { sign } = jwtPkg;
import Admin from "../../models/Admin.js";

/**
 * Add admin controller
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const addAdmin = async (req, res) => {
  try {
    let { firstName, lastName, email, password } = req.body;

    // insert data for database
    let admin = await Admin.create({
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

/**
 * Login admin controller
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const adminLogIn = async (req, res) => {
  try {
    let { adminEmail, adminPassword } = req.body;
    console.log(adminEmail);

    let admin = await Admin.findOne({
      where: {
        email: adminEmail,
      },
    });

    console.log(admin);

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

/**
 * Remover admin controller
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const removeAdmin = async (req, res) => {
  try {
    let { adminId } = req.params;

    let deletedRows = await Admin.destroy({
      where: { id: adminId },
      force: true,
    });

    if (deletedRows < 1)
      return res.status(401).json({
        message: "Unable to remove admin from admin panel",
      });

    res.status(200).json({
      message: "Successfully remove admin from admin panel",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error removing admin from admin panel",
    });
  }
};
