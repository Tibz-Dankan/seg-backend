/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `_users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phoneNumber` to the `_users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "_users" ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "_users_phoneNumber_key" ON "_users"("phoneNumber");
