import { compareSync } from "bcrypt";
import jwtPkg from "jsonwebtoken";
const { sign } = jwtPkg;
import Admin from "../../models/Admin.js";
import { transporter } from "../../util/util.js";

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

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      sender: `6thtouch - <${process.env.EMAIL_USER}>`,
      to: admin.email,
      subject: `6thtouch Admin Dashboard | Admin Invitation`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
            }
            .email-container {
              max-width: 600px;
              margin: 20px auto;
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background-color: #4CAF50;
              color: white;
              text-align: center;
              padding: 30px 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .content {
              padding: 20px;
            }
            .content h2 {
              color: #333;
              font-size: 22px;
              margin-bottom: 10px;
            }
            .content p {
              font-size: 16px;
              color: #555;
              line-height: 1.6;
            }
            .feature-list {
              margin: 20px 0;
              padding-left: 20px;
              list-style-type: disc;
            }
            .footer {
              background-color: #f9f9f9;
              color: #888;
              text-align: center;
              padding: 10px;
              font-size: 12px;
            }
            .logo {
              width: 50px;
              height: 50px;
            }
            .btn-container{
              text-align: center;
            }
            .open-btn{
              background-color: #4CAF50;
              color: white;
              padding: 5px;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <img src="https://www.6thtouchrobotics.com.ng/assets/images/6thtouch_logo.png" alt="Logo" class="logo" />
              <h1>Welcome to 6thtouch Admin Dashboard!</h1>
            </div>
            <div class="content">
              <h2>Hi ${admin.firstName},</h2>
              <p>You've been added as admin on the <strong>6thtouch Admin Dashboard</strong>, 
              We are happy to have you join us build our community</p>
              <p>Here’re your credentials to access Dashboard:</p>
              <ul class="feature-list">
                <li><strong>Email:</strong> ${admin.email}</li>
                <li><strong>Passkey:</strong> ${password}</li>
              </ul>
              <p>
                Get started today and begin your teaching journey. If you need any help, our support team is always here to assist you.
              </p>
              <div class="btn-container">
                <a href="https://6thtouch-admin.vercel.app" target="_blank" class="open-btn">Open Dashboard</a>
              </div>
              <p>Welcome aboard!</p>
              <p>The 6thtouch Team</p>
            </div>
            <div class="footer">
              © 2024 6thtouch | Empowering Learning Everywhere.
            </div>
          </div>
        </body>
        </html>
        `,
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
