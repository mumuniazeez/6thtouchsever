import { Router } from "express";
import { authorize, db } from "../util/util.js";
import { config } from "dotenv";
import { logIn, signUp } from "../controllers/auth.js";
import { deleteMyProfile, editProfile, myProfile } from "../controllers/users.js";
const router = Router();
config();

// authentication routes
router.post("/auth/signup", signUp);
router.post("/auth/login", logIn);

// users routes
router.get("/user/me", authorize, myProfile);
router.patch("/user/me", authorize, editProfile);
router.delete("/user/me", authorize, deleteMyProfile);

export default router;
