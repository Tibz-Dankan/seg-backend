/*
  Warnings:

  - You are about to drop the column `role` on the `_signup_tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "_signup_tokens" DROP COLUMN "role",
ADD COLUMN     "associatedRole" "Role" NOT NULL DEFAULT 'admin';
