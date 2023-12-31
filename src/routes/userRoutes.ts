import express from "express";
import {
  signUp,
  signIn,
  resetPassword,
  forgotPassword,
  changePassword,
  editUserDetails,
  updateUserImage,
  protectAdmin,
  getUser,
} from "../controllers/userController";
import { uploadFile } from "../utils/upload";
import { validateSignupToken } from "../controllers/tokenController";

const router = express.Router();

router.post("/signup", validateSignupToken, signUp);
router.post("/signin", signIn);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);
router.patch("/edit-user-details/:userId", protectAdmin, editUserDetails);
router.patch(
  "/upload-user-image/:userId",
  uploadFile,
  protectAdmin,
  updateUserImage
);
router.patch("/change-password/:userId", protectAdmin, changePassword);
router.get("/get-user/:userId", getUser);

export { router as userRoutes };
