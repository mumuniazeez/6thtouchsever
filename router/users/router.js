import { Router } from "express";
import {
  login,
  signUp,
  requestOTP,
  verifyOTP,
  resetPassword,
  changePassword,
} from "../../controllers/users/auth.js";
import { authenticateUser, memoryUpload } from "../../util/util.js";
import {
  deleteMyProfile,
  editMyProfile,
  getMyProfile,
  changeAvatar,
} from "../../controllers/users/user.js";
import {
  getAllPublishedCourse,
  getAllPublishedCourseByCategory,
  getCourseByID,
  getMyCourses,
  searchMyCourses,
  searchPublishedCourses,
  addFreeCourseToMyCourses,
} from "../../controllers/users/courses.js";
import { createReport } from "../../controllers/users/report.js";
import rateLimit from "express-rate-limit";
import {
  getCourseTopics,
  getTopicByID,
  markAsComplete,
} from "../../controllers/users/topic.js";
import {
  createPayment,
  getPayment,
  getPaymentById,
} from "../../controllers/users/payment.js";

/**
 * User router
 */
const router = Router();

/**
 * OTP request limiter, set OTP requests to 1 request per windowMs
 */
const OTPRequestLimiter = rateLimit({
  limit: 1,
  message: {
    message: "Too many request, try again after 1 minute",
  },
});

// authentication routes
router.post("/auth/signup", signUp);
router.post("/auth/login", login);
router.patch("/auth/changePassword", authenticateUser, changePassword);
router.post("/auth/requestOTP", OTPRequestLimiter, requestOTP);
router.post("/auth/verifyOTP", verifyOTP);
router.patch("/auth/resetPassword", resetPassword);

// user routes
router.get("/user/me", authenticateUser, getMyProfile);
router.patch("/user/me", authenticateUser, editMyProfile);
router.delete("/user/me", authenticateUser, deleteMyProfile);
router.patch(
  "/user/changeAvatar",
  authenticateUser,
  memoryUpload.single("avatar"),
  changeAvatar
);

// courses routes
router.get("/courses", getAllPublishedCourse);
router.get("/courses/myCourses", authenticateUser, getMyCourses);
router.get("/courses/myCourses/search", authenticateUser, searchMyCourses);
router.get("/courses/search/", searchPublishedCourses);
router.get("/courses/category/:category", getAllPublishedCourseByCategory);
router.get("/courses/:courseId/topics", getCourseTopics);
router.get("/courses/topics/:topicId", getTopicByID);
router.get("/courses/:courseId", getCourseByID);
router.put(
  "/courses/topics/:topicId/complete",
  authenticateUser,
  markAsComplete
);
router.post("/courses/free/add", authenticateUser, addFreeCourseToMyCourses);

// reports route
router.post("/reports/create", authenticateUser, createReport);

// payment routes
router.post("/payments/create", authenticateUser, createPayment);
router.get("/payments/me", authenticateUser, getPayment);
router.get("/payments/:paymentId", authenticateUser, getPaymentById);

export default router;
