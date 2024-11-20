import { compareSync } from "bcrypt";
import Users from "../../models/users.js";
import Otp from "../../models/otp.js";
import jwtPkg from "jsonwebtoken";
const { sign } = jwtPkg;
import { config } from "dotenv";
config();
import crypto from "crypto";
import { transporter } from "../../util/util.js";
import dotenv from "dotenv";

dotenv.config();

export const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // creating the user account
    const user = await Users.create({
      firstName,
      lastName,
      email,
      password,
    });

    // checking if the user account as been created
    if (!user)
      return res.status(400).json({
        message: "Error creating user account",
      });

    // sending message to client
    res.status(200).json({
      message: "Successfully created user account",
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      sender: `6thtouch - <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `6thtouch | Start Learning`,
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
              color: #4CAF50;
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
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <img src="https://www.6thtouchrobotics.com.ng/assets/images/6thtouch_logo.png" alt="Logo" class="logo" />
              <h1>Welcome to 6thouch!</h1>
            </div>
            <div class="content">
              <h2>Hi ${user.firstName},</h2>
              <p>We're thrilled to have you join us at 6thouch, the platform where learning is fun, flexible, and accessible.</p>
              <p>Here’s what you can do:</p>
              <ul class="feature-list">
                <li>Explore and purchase courses on various topics.</li>
                <li>Watch high-quality video lessons at your own pace.</li>
                <li>Take notes directly while watching lessons.</li>
                <li>Track your progress and earn certificates.</li>
              </ul>
              <p>
                Get started today and begin your learning journey. If you need any help, our support team is always here to assist you.
              </p>
           
              <p>Welcome aboard!</p>
              <p>The 6thouch Team</p>
            </div>
            <div class="footer">
              © 2024 6thouch | Empowering Learning Everywhere.
            </div>
          </div>
        </body>
        </html>
        `,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error creating user account",
      error,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // getting the user with the email provided
    const user = await Users.findOne({
      where: {
        email,
      },
    });

    // checking if the user exist
    if (!user)
      return res.status(401).json({
        message: "Incorrect email or password",
      });

    // verifying the password provided
    const passwordValidated = compareSync(password, user.password);
    if (!passwordValidated)
      return res.status(401).json({
        message: "Incorrect email or password",
      });

    let tokenData = {
      id: user.id,
      email: user.email,
    };
    // signing jwt token
    let token = sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "60days",
    });

    // sending token to client
    res.status(200).json({
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error logging",
      error,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    let { id } = req.user;
    let { currentPassword, newPassword } = req.body;

    // getting the user with the email provided
    const user = await Users.findByPk(id);

    // checking if the user exist
    if (!user)
      return res.status(404).json({
        message: "User account not found",
      });

    // verifying the password the provided
    const passwordValidated = compareSync(currentPassword, user.password);
    if (!passwordValidated)
      return res.status(401).json({
        message: "Incorrect password",
      });

    // updating the use password
    await user.update({
      password: newPassword,
    });

    // sending message to client
    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error changing password",
      error,
    });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await Users.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999); // 6-digit OTP
    const expiration = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save OTP to database
    await Otp.create({ email, otp, expiresAt: expiration });

    console.log(otp);

    await transporter.sendMail({
      // from: `6thtouch - <${process.env.EMAIL_USER}>`,
      from: process.env.EMAIL_USER,
      sender: `6thtouch - <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${otp} - 6thtouch | OTP Code message`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
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
      padding: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 22px;
    }
    .content {
      padding: 20px;
    }
    .content p {
      font-size: 16px;
      color: #333;
      line-height: 1.5;
    }
    .otp-box {
      text-align: center;
      background-color: #f4f4f9;
      border: 1px dashed #4CAF50;
      margin: 20px 0;
      padding: 15px;
      border-radius: 8px;
      font-size: 24px;
      color: #4CAF50;
      font-weight: bold;
    }
    .footer {
      background-color: #f9f9f9;
      color: #888;
      text-align: center;
      padding: 10px;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>6thtouch | OTP Code</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${user.firstName} ${user.lastName}</strong>,</p>
      <p>
        You recently requested to verify your account. Use the code below to complete the verification process.
      </p>
      <div class="otp-box">
        ${otp}
      </div>
      <p>
        This OTP is valid for the next <strong>10 minutes</strong>. If you didn’t request this code, you can safely ignore this email.
        <br />
        <strong>Don't share your OTP with anyone.</strong>
      </p>
      <p>Thank you,</p>
      <p>The 6thtouch Team</p>
    </div>
    <div class="footer">
      © 2024 6thtouch | All rights reserved.
    </div>
  </div>
</body>
</html>
`,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error requesting reset password",
      error,
    });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  // Find OTP record
  const otpRecord = await Otp.findOne({ where: { email, otp } });
  if (!otpRecord || otpRecord.expiresAt < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }
  await otpRecord.destroy({ force: true });

  res.json({ message: "OTP verified successfully" });
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  // Update user's password
  await Users.update({ password: newPassword }, { where: { email } });

  res.json({ message: "Password reset successfully" });
};
