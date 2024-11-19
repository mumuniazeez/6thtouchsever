import { Router } from "express";
import { addAdmin, adminLogIn } from "../../controllers/admins/auth.js";
import {
  getAdminProfile,
  editAdminProfile,
  deleteAdminProfile,
} from "../../controllers/admins/admin.js";
import { authenticateAdmin, memoryUpload } from "../../util/util.js";
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
} from "../../controllers/admins/courses.js";

let router = Router();

/* admin routes */
// admin auth routes
router.post("/auth/login", adminLogIn);
router.post("/auth/addAdmin", authenticateAdmin, addAdmin);

// admin profile
router.get("/me", authenticateAdmin, getAdminProfile);
router.patch("/me", authenticateAdmin, editAdminProfile);
router.delete("/me", authenticateAdmin, deleteAdminProfile);

// admin courses route
router.post(
  "/courses/create",
  authenticateAdmin,
  memoryUpload.single("thumbnail"),
  createCourse
);

router.get("/courses", authenticateAdmin, getAllCourse);
router.get("/courses/search", authenticateAdmin, searchAllCourses);
router.get(
  "/courses/category/:category",
  authenticateAdmin,
  getAllCourseByCategory
);

router.post(
  "/courses/:courseId/topics/add",
  authenticateAdmin,
  memoryUpload.single("video"),
  createTopic
);

router.patch(
  "/courses/:courseId/edit",
  authenticateAdmin,
  memoryUpload.single("thumbnail"),
  editCourse
);

router.patch(
  "/courses/:courseId/topics/:topicId/edit",
  authenticateAdmin,
  memoryUpload.single("video"),
  editTopic
);

router.delete("/courses/:courseId/delete", authenticateAdmin, deleteCourse);

router.delete(
  "/courses/:courseId/topics/:topicId/delete",
  authenticateAdmin,
  deleteTopic
);

router.patch("/courses/:courseId/publish", authenticateAdmin, publishCourse);

router.patch(
  "/courses/:courseId/unpublish",
  authenticateAdmin,
  unpublishCourse
);

export default router;
