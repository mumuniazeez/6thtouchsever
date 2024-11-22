import { Router } from "express";
import { addAdmin, adminLogIn } from "../../controllers/admins/auth.js";
import {
  getAdminProfile,
  editAdminProfile,
  deleteAdminProfile,
  changeAdminAvatar,
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
router.patch(
  "/admin/changeAvatar",
  authenticateAdmin,
  memoryUpload.single("avatar"),
  changeAdminAvatar
);

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
  "/courses/:courseId",
  authenticateAdmin,
  memoryUpload.single("thumbnail"),
  editCourse
);

router.patch(
  "/courses/topics/:topicId",
  authenticateAdmin,
  memoryUpload.single("video"),
  editTopic
);

router.delete("/courses/:courseId", authenticateAdmin, deleteCourse);

router.delete("/courses/topics/:topicId", authenticateAdmin, deleteTopic);

router.patch("/courses/:courseId/publish", authenticateAdmin, publishCourse);

router.patch(
  "/courses/:courseId/unpublish",
  authenticateAdmin,
  unpublishCourse
);

export default router;
