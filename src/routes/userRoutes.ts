import express from "express";
import {
  signUp,
  signIn,
  resetPassword,
  forgotPassword,
  changePassword,
  editUserDetails,
  updateUserImage,
  protect,
  getUser,
} from "../controllers/userController";
import { uploadFile } from "../utils/upload";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);
router.patch("/edit-user-details/:userId", protect, editUserDetails);
router.patch(
  "/upload-user-image/:userId",
  uploadFile,
  protect,
  updateUserImage
);
router.patch("/change-password/:userId", protect, changePassword);
router.get("/get-user/:userId", getUser);

export { router as userRoutes };
