import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error";
import { asyncHandler } from "../utils/asyncHandler";
import { PrismaClient } from "@prisma/client";
import { RandomNumber } from "../utils/random";

const prisma = new PrismaClient();
const SignupToken = prisma.signupToken;

export const generateSignupToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = res.locals.user.userId as string;
    const associatedEmail = req.body.associatedEmail as string;

    if (!userId) {
      return next(new AppError("Please provide userId", 400));
    }
    if (!associatedEmail.includes("@")) {
      return next(new AppError("Please provide a valid email", 400));
    }

    const token = new RandomNumber().d8();

    const newToken = await SignupToken.create({
      data: {
        token: token,
        associatedEmail: associatedEmail,
        generatedByUserId: userId,
      },
      select: {
        tokenId: true,
        token: true,
        generatedByUserId: true,
        used: true,
        usedAt: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Signup Token created successfully",
      data: { token: newToken },
    });
  }
);

export const getSignupTokensByGeneratedByUserId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const generatedByUserId = req.query.generatedByUserId as string;
    if (!generatedByUserId) {
      return next(new AppError("Please provide userId", 400));
    }
    const tokens = await SignupToken.findMany({
      where: { generatedByUserId: { equals: generatedByUserId } },
    });

    if (!tokens) {
      return next(new AppError("No tokens found for this user", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Signup Tokens fetched successfully",
      data: { tokens: tokens },
    });
  }
);

export const getAllSignupTokens = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const tokens = await SignupToken.findMany({});

    if (!tokens) {
      return next(new AppError("No tokens found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Signup Tokens fetched successfully",
      data: { tokens: tokens },
    });
  }
);

export const editSignupToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const tokenId = req.params.tokenId;
    const userId = res.locals.user.userId as string;
    if (!tokenId) {
      return next(new AppError("Please provide userId", 400));
    }
    const token = await SignupToken.findFirst({
      where: { tokenId: { equals: tokenId } },
    });
    if (!token) {
      return next(new AppError("Token not found", 404));
    }
    if (userId !== token.generatedByUserId) {
      return next(
        new AppError("Not authorized to perform this operation", 401)
      );
    }
    if (token.used) {
      return next(new AppError("Can't edit already used token", 400));
    }

    const generatedToken = new RandomNumber().d8();

    const updatedToken = await SignupToken.update({
      where: { tokenId: tokenId },
      data: { token: generatedToken },
      select: {
        tokenId: true,
        token: true,
        generatedByUserId: true,
        used: true,
        usedAt: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Signup Token edited successfully",
      data: { token: updatedToken },
    });
  }
);

export const deleteSignupToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const tokenId = req.params.tokenId;
    const userId = res.locals.user.userId as string;
    if (!tokenId) {
      return next(new AppError("Please provide userId", 400));
    }
    const token = await SignupToken.findFirst({
      where: { tokenId: { equals: tokenId } },
    });
    if (!token) {
      return next(new AppError("Token not found", 404));
    }
    if (userId !== token.generatedByUserId) {
      return next(
        new AppError("Not authorized to perform this operation", 401)
      );
    }
    if (token.used) {
      return next(new AppError("Can't delete already used token", 400));
    }

    await SignupToken.delete({ where: { tokenId: tokenId } });

    res.status(200).json({
      status: "success",
      message: "Signup Token deleted successfully",
    });
  }
);
