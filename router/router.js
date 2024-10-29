import { Router } from "express";
import { userAuthorize, db } from "../util/util.js";
import { config } from "dotenv";
import { logIn, signUp } from "../controllers/auth.js";
import {
  deleteMyProfile,
  editProfile,
  myProfile,
} from "../controllers/users.js";
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
router.get("/courses")
router.get("/courses/:courseId/topics");
router.get("/courses/:courseId");
router.get("/courses/:courseId/topics/:topicId");

/* admin routes */
// admin auth routes
router.post("admin/auth/login");
// admin courses route
router.post("/admin/courses/create");
router.post("/admin/courses/:courseId/topics/add");

export default router;
