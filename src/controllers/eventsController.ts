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
    if (!files[0]) {
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

      await EventImage.create({
        data: { eventId: eventId, imageUrl: url, imagePath: imagePath },
      });
    }

    const eventImages = await EventImage.findMany({
      where: { eventId: { equals: eventId } },
      select: { eventImageId: true, imageUrl: true },
    });
    event.eventImages = eventImages;

    res.status(201).json({
      status: "success",
      message: "Event created successfully",
      data: { event: event },
    });
  }
);

export const updateEvent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const title = req.body.title as string;
    const category = req.body.category as EventCategory;
    const description = req.body.description as string;
    const eventId = req.params.eventId;

    if (!eventId) {
      return next(new AppError("Please provide eventId", 400));
    }
    if (!title || !category || !description) {
      return next(new AppError("Please fill out all fields", 400));
    }
    if (!validateEventCategory(category)) {
      return next(new AppError("Please provide a valid event category", 400));
    }

    const updatedEvent = await Event.update({
      where: { eventId: eventId },
      data: req.body,
      select: {
        eventId: true,
        title: true,
        category: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Event updated successfully",
      data: { event: updatedEvent },
    });
  }
);

export const deleteEvent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.params.eventId;
    if (!eventId) return next(new AppError("Please provide eventId", 400));

    const event = await Event.findFirst({
      where: { eventId: eventId },
    });

    if (!event) {
      return next(new AppError("event with provided Id is not found", 404));
    }
    // TODO: delete images for even from firebase
    await Event.delete({ where: { eventId: eventId } });

    res.status(200).json({
      status: "success",
      message: "Event deleted successfully",
    });
  }
);

export const getEvent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.params.eventId;
    if (!eventId) return next(new AppError("Please provide eventId", 400));

    const event = await Event.findFirst({
      where: { eventId: eventId },
      include: {
        eventImages: {
          select: { eventImageId: true, imageUrl: true },
        },
      },
    });

    res.status(200).json({
      status: "success",
      message: "Event fetched successfully",
      data: { event: event },
    });
  }
);

export const getAllEvents = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const skip = Number(req.query.skip);
    const take = Number(req.query.take);
    const page = Number(req.query.page);

    if (skip !== 0 && !skip) {
      return next(new AppError("Please provide skip", 400));
    }
    if (!take) return next(new AppError("Please provide take", 400));
    if (!page) return next(new AppError("Please provide page number", 400));

    const event = await Event.findMany({
      include: {
        eventImages: {
          select: { eventImageId: true, imageUrl: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: take,
      skip: skip,
    });

    res.status(200).json({
      status: "success",
      message: "Events fetched successfully",
      data: { event: event },
    });
  }
);

export const updateEventImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file as TFile;
    const eventImageId = req.params.eventImageId;
    if (!file) return next(new AppError("Please provide event image", 400));
    if (!eventImageId) {
      return next(new AppError("Please provide eventImageId", 400));
    }

    const savedImage = await EventImage.findFirst({
      where: { eventImageId: eventImageId },
    });
    if (!savedImage) {
      return next(new AppError("Image with provided Id is not found", 404));
    }
    const savedImagePath = savedImage?.imagePath as string;

    const imagePath = `events/${Date.now()}_${file.originalname}`;
    const upload = await new Upload(imagePath, next).update(
      file,
      savedImagePath
    );

    const url = upload?.url as string;

    const updatedEventImage = await EventImage.update({
      where: { eventImageId: eventImageId },
      data: { imageUrl: url, imagePath: imagePath },
      select: { eventImageId: true, imageUrl: true },
    });

    res.status(200).json({
      status: "success",
      message: "Event Image updated successfully",
      data: { eventImage: updatedEventImage },
    });
  }
);

export const deleteEventImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const eventImageId = req.params.eventImageId;
    if (!eventImageId) {
      return next(new AppError("Please provide eventImageId", 400));
    }

    const savedImage = await EventImage.findFirst({
      where: { eventImageId: eventImageId },
    });
    if (!savedImage) {
      return next(new AppError("Image with provided Id is not found", 404));
    }
    const savedImagePath = savedImage?.imagePath as string;

    await new Upload(savedImagePath, next).delete();
    await EventImage.delete({ where: { eventImageId: eventImageId } });

    res.status(200).json({
      status: "success",
      message: "Event Image deleted successfully",
    });
  }
);
