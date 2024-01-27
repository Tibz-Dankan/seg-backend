import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error";
import { asyncHandler } from "../utils/asyncHandler";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const NewsLetter = prisma.newsLetter;

export const subscribeToNewsLetter = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email as string;

    if (!email) return next(new AppError("Please provide your email", 400));

    const savedEmail = await NewsLetter.findFirst({
      where: { email: { equals: email } },
    });

    if (savedEmail) {
      return next(new AppError("Provided email is already subscribed", 400));
    }

    await NewsLetter.create({ data: { email: email } });

    res.status(201).json({
      status: "success",
      message: "Subscribed to SEG-MUK newsletter successfully",
    });
  }
);
