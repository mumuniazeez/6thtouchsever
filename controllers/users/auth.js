import { compareSync } from "bcrypt";
import Users from "../../models/users.js";
import jwtPkg from "jsonwebtoken";
const { sign } = jwtPkg;
import { config } from "dotenv";
config();

import nodemailer from "nodemailer";
import { TOTP, Secret } from "otpauth";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const users = {};


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
    const user = await Users.findOne({
      where: {
        id,
      },
    });

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

// Mock user database

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === 465, // use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  socketTimeout: 60000, // 1 minute timeout for the socket
  connectionTimeout: 60000, // 30 seconds for the connection timeout
});

const sendEmailWithRetry = async (mailOptions, attempts = 3, res) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.log(error);
    if (attempts > 0) {
      console.log(`Retrying... Attempts left: ${attempts}`);
      setTimeout(
        () => sendEmailWithRetry(mailOptions, attempts - 1, res),
        3000
      ); // Retry after 3 seconds
    } else {
      console.error("Failed to send email after retries:", error);
      res.status(500).send("Failed to send OTP. Please try again.");
    }
  }
};

export const requestReset = async (req, res) => {
  const { email } = req.body;

  const user = await Users.findOne({
    where: { email },
  });
  if (!user) return res.status(404).send("User not found.");

  const totp = new TOTP({
    issuer: "YourCompany",
    label: email,
    algorithm: "SHA1",
    digits: 6,
    period: process.env.OTP_EXPIRY_MINUTES * 60,
    secret: new Secret(),
  });

  const otp = totp.generate();
  user.otp = otp;
  user.otpExpiry = Date.now() + process.env.OTP_EXPIRY_MINUTES * 60000;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    html: `
           nn
            
        `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("OTP sent to your email.");
  } catch (error) {
    console.error("Error sending email:", error);
    let attempts = 3;
    sendEmailWithRetry(mailOptions, 3, res);
  }
};

export const verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).send("Email and OTP are required.");

  const user = users[email];
  if (!user || !user.otp) return res.status(404).send("OTP request not found.");

  if (user.otpExpiry < Date.now())
    return res.status(400).send("OTP has expired.");

  const totp = new TOTP({
    issuer: "YourCompany",
    label: email,
    algorithm: "SHA1",
    digits: 6,
    period: process.env.OTP_EXPIRY_MINUTES * 60,
    secret: Secret.fromB32(user.otp),
  });

  if (totp.validate({ token: otp }) !== null) {
    user.isOtpVerified = true;
    delete user.otp;
    delete user.otpExpiry;
    res.status(200).send("OTP verified successfully.");
  } else {
    res.status(400).send("Invalid OTP.");
  }
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword)
    return res.status(400).send("Email and new password are required.");

  const user = users[email];
  if (!user || !user.isOtpVerified)
    return res.status(403).send("OTP verification required.");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.isOtpVerified = false;
  res.status(200).send("Password reset successful.");
};
