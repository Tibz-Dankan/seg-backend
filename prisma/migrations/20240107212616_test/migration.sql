-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('exhibition', 'conference');

-- CreateTable
CREATE TABLE "_events" (
    "eventId" TEXT NOT NULL,
    "postByUserId" TEXT NOT NULL,
    "category" "EventCategory" NOT NULL DEFAULT 'exhibition',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "_events_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "_event_images" (
    "eventImageId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imagePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "_event_images_pkey" PRIMARY KEY ("eventImageId")
);

-- CreateIndex
CREATE INDEX "_events_eventId_idx" ON "_events"("eventId");

-- CreateIndex
CREATE INDEX "_events_postByUserId_idx" ON "_events"("postByUserId");

-- CreateIndex
CREATE INDEX "_events_category_idx" ON "_events"("category");

-- CreateIndex
CREATE INDEX "_event_images_eventImageId_idx" ON "_event_images"("eventImageId");

-- CreateIndex
CREATE INDEX "_event_images_eventId_idx" ON "_event_images"("eventId");

-- AddForeignKey
ALTER TABLE "_events" ADD CONSTRAINT "_events_postByUserId_fkey" FOREIGN KEY ("postByUserId") REFERENCES "_users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_event_images" ADD CONSTRAINT "_event_images_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "_events"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;
