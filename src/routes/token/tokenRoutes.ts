import express from "express";
import { protectSuperAdmin } from "../../controllers/userController";
import {
  generateSignupToken,
  getSignupTokensByGeneratedByUserId,
  editSignupToken,
  deleteSignupToken,
  getAllSignupTokens,
} from "../../controllers/tokenController";

const router = express.Router();

router.post("/generate-signup-token", protectSuperAdmin, generateSignupToken);
router.get(
  "/get-signup-tokens",
  protectSuperAdmin,
  getSignupTokensByGeneratedByUserId
);
router.get("/get-all-tokens", protectSuperAdmin, getAllSignupTokens);
router.patch("/edit-signup-token/:tokenId", protectSuperAdmin, editSignupToken);
router.delete(
  "/delete-signup-token/:tokenId",
  protectSuperAdmin,
  deleteSignupToken
);

export { router as tokenRoutes };
