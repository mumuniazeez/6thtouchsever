import Payment from "../../models/Payment.js";
import Course from "../../models/Course.js";
import User from "../../models/User.js";

/**
 * Create Payment For Course
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const createPayment = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { courseId, transactionId, paymentReference } = req.body;

    const course = await Course.findByPk(courseId);
    if (!course)
      return res.status(404).json({
        message: "Course not found",
      });
    const user = await User.findByPk(userId);
    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    await user.addCourse(course);
    const payment = await Payment.create({
      courseId,
      userId,
      transactionId,
      paymentReference,
    });

    if (!payment)
      return res.status(400).json({
        message: "Payment not recorded",
      });
    res.status(200).json({
      message: "Payment successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Payment not recorded",
    });
  }
};

/**
 * Get Payment History for a course
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getPayment = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const payments = await Payment.findAll({
      where: { userId },
      include: { all: true },
    });

    if (!payments)
      return res.status(400).json({
        message: "You haven't made any payments",
      });

    res.json(payments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Unable to fetch payment",
    });
  }
};

/**
 * Get Payment By Id for a course
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payments = await Payment.findByPk(paymentId, {
      include: {
        all: true,
      },
    });

    if (!payments)
      return res.status(400).json({
        message: "You haven't made any payments",
      });

    res.json(payments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Unable to fetch payment",
    });
  }
};
