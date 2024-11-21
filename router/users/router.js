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

const router = Router();

// authentication routes
router.post("/auth/signup", signUp);
router.post("/auth/login", login);
router.patch("/auth/changePassword", authenticateUser, changePassword);
router.post("/auth/requestOTP", requestOTP);
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
router.get("/courses/:courseId/topics/:topicId", getTopicByID);
router.get("/courses/:courseId", getCourseByID);

export default router;
