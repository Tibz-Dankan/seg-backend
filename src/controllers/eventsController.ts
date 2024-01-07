import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error";
import { asyncHandler } from "../utils/asyncHandler";
import { PrismaClient } from "@prisma/client";
import { Upload } from "../utils/upload";
import { EventCategory } from "../types/eventCategory";
import { TFile } from "../types/file";

const prisma = new PrismaClient();
const Event = prisma.event;
const EventImage = prisma.eventImage;

const validateEventCategory = (event: string): boolean => {
  const isExhibition = event === EventCategory.EXHIBITION;
  const isConference = event === EventCategory.CONFERENCE;

  if (isExhibition || isConference) {
    return true;
  }
  return false;
};

export const postEvent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const title = req.body.title as string;
    const category = req.body.category as EventCategory;
    const description = req.body.description as string;
    const userId = res.locals.user.userId;
    const files = req.files as TFile[];

    if (!userId) {
      return next(new AppError("Please provide  the userId", 400));
    }
    if (!title || !category || !description) {
      return next(new AppError("Please fill out all fields", 400));
    }
    if (!validateEventCategory(category)) {
      return next(new AppError("Please provide a valid event category", 400));
    }
    if (files == undefined) {
      return next(new AppError("Please Provide at least one event photo", 400));
    }

    const newEvent = await Event.create({
      data: {
        title: title,
        category: category,
        description: description,
        postByUserId: userId,
      },
      select: {
        eventId: true,
        title: true,
        category: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.locals.event = newEvent;
    next();
  }
);

export const uploadEventImages = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as TFile[];

    const event = res.locals.event;
    const eventId = event.eventId as string;

    for (let i = 0; i < files.length; i++) {
      const imagePath = `events/${Date.now()}_${files[i].originalname}`;
      const upload = await new Upload(imagePath, next).add(files[i]);
      const url = upload?.url as string;

      console.log("url from firebase");
      console.log(url);

      await EventImage.create({
        data: { eventId: eventId, imageUrl: url, imagePath: imagePath },
      });
    }

    const eventImages = await EventImage.findMany({
      where: { eventId: { equals: eventId } },
      select: { imageUrl: true },
    });
    event.eventImages = eventImages;

    res.status(201).json({
      status: "success",
      message: "Event created successfully",
      data: { event: event },
    });
  }
);
