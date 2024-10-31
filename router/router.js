import { Router } from "express";
import { userAuthorize } from "../util/util.js";
import { config } from "dotenv";
import { logIn, signUp } from "../controllers/auth.js";
import {
  deleteMyProfile,
  editProfile,
  myProfile,
} from "../controllers/users.js";
import {
  getAllPublicCourse,
  getAllPublicCourseByCategory,
  getCourseByID,
  getCourseTopics,
  getMyCourses,
  getTopicByID,
  searchPublicCourses,
} from "../controllers/courses.js";

const router = Router();
config();
// authentication routes
router.post("/auth/signup", signUp);
router.post("/auth/login", logIn);

// users routes
router.get("/user/me", userAuthorize, myProfile);
router.patch("/user/me", userAuthorize, editProfile);
router.delete("/user/me", userAuthorize, deleteMyProfile);

// courses routes
router.get("/courses", getAllPublicCourse);
router.get("/courses/myCourses", userAuthorize, getMyCourses);
router.get("/courses/search/", searchPublicCourses);
router.get("/courses/category/:category", getAllPublicCourseByCategory);
router.get("/courses/:courseId/topics", getCourseTopics);
router.get("/courses/:courseId/topics/:topicId", getTopicByID);
router.get("/courses/:courseId", getCourseByID);

export default router;
