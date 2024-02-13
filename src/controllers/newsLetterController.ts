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

export const getAllNewsLetterSubscribers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const subscribers = await NewsLetter.findMany({});
    if (!subscribers) {
      return next(new AppError("No subscribers found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "fetched subscribers",
      data: {
        subscribers: subscribers,
      },
    });
  }
);

export const postNewsLetter = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email as string;

    const recipients = JSON.parse(req.body.recipients) as string[];
    const newLettersTitle = req.body.newLettersTitle;
    const newLettersBody = req.body.newLettersBody;

    if (!newLettersTitle) {
      new AppError("Please provide newLettersTitle", 400);
    }

    if (!newLettersBody) {
      new AppError("Please provide newLettersBody", 400);
    }

    if (!recipients[0]) {
      new AppError("Please provide at least one recipient", 400);
    }

    // TODO:capture images here

    // TODO: implement the newsLetter sending functionality

    res.status(201).json({
      status: "success",
      message: "NewsLetter sent to recipients successfully",
    });
  }
);
