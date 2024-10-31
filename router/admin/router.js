import { Router } from "express";
import { config } from "dotenv";
import { addAdmin, adminLogIn } from "../../controllers/admin/auth.js";
import {
  adminAuthorize,
  thumbnailUpload,
  videoUpload,
} from "../../util/util.js";
import {
  createCourse,
  createTopic,
  deleteCourse,
  deleteTopic,
  editCourse,
  editTopic,
  getAllCourse,
  getAllCourseByCategory,
  publishCourse,
  searchAllCourses,
  unpublishCourse,
} from "../../controllers/admin/courses.js";

const router = Router();
config();

/* admin routes */
// admin auth routes
router.post("/auth/login", adminLogIn);
router.post("/auth/addAdmin", adminAuthorize, addAdmin);

// admin courses route
router.post(
  "/courses/create",
  adminAuthorize,
  thumbnailUpload.single("thumbnail"),
  createCourse
);

router.get("/courses", adminAuthorize, getAllCourse);
router.get("/courses/search", adminAuthorize, searchAllCourses);
router.get(
  "/courses/category/:category",
  adminAuthorize,
  getAllCourseByCategory
);

router.post(
  "/courses/:courseId/topics/add",
  adminAuthorize,
  videoUpload.single("video"),
  createTopic
);

router.patch(
  "/courses/:courseId/edit",
  adminAuthorize,
  thumbnailUpload.single("thumbnail"),
  editCourse
);

router.patch(
  "/courses/:courseId/topics/:topicId/edit",
  adminAuthorize,
  videoUpload.single("video"),
  editTopic
);

router.delete("/courses/:courseId/delete", adminAuthorize, deleteCourse);

router.delete(
  "/courses/:courseId/topics/:topicId/delete",
  adminAuthorize,
  deleteTopic
);

router.patch("/courses/:courseId/publish", adminAuthorize, publishCourse);

router.patch("/courses/:courseId/unpublish", adminAuthorize, unpublishCourse);

export default router;
