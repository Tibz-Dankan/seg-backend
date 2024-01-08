-- DropForeignKey
ALTER TABLE "_event_images" DROP CONSTRAINT "_event_images_eventId_fkey";

-- AddForeignKey
ALTER TABLE "_event_images" ADD CONSTRAINT "_event_images_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "_events"("eventId") ON DELETE CASCADE ON UPDATE CASCADE;
