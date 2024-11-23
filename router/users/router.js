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
  getCourseTopics,
  getMyCourses,
  getTopicByID,
  searchPublishedCourses,
} from "../../controllers/users/courses.js";
import { createReport } from "../../controllers/users/report.js";
import rateLimit from "express-rate-limit";

const router = Router();

const OTPRequestLimiter = rateLimit({
  limit: 1,
  message: {
    message: "Too many request try again after 1 minute",
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
router.get("/courses/search/", searchPublishedCourses);
router.get("/courses/category/:category", getAllPublishedCourseByCategory);
router.get("/courses/:courseId/topics", getCourseTopics);
router.get("/courses/topics/:topicId", getTopicByID);
router.get("/courses/:courseId", getCourseByID);

// reports endpoint
router.post("/report/create", authenticateUser, createReport);

export default router;
