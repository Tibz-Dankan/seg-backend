-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'superadmin');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateTable
CREATE TABLE "_users" (
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'admin',
    "password" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imagePath" TEXT,
    "passwordResetToken" TEXT,
    "passwordResetExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "_users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "_signup_tokens" (
    "tokenId" TEXT NOT NULL,
    "generatedByUserId" TEXT NOT NULL,
    "token" INTEGER NOT NULL,
    "associatedEmail" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "_signup_tokens_pkey" PRIMARY KEY ("tokenId")
);

-- CreateTable
CREATE TABLE "_access_tokens" (
    "tokenId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "_access_tokens_pkey" PRIMARY KEY ("tokenId")
);

-- CreateIndex
CREATE UNIQUE INDEX "_users_email_key" ON "_users"("email");

-- CreateIndex
CREATE INDEX "_users_userId_idx" ON "_users"("userId");

-- CreateIndex
CREATE INDEX "_users_email_idx" ON "_users"("email");

-- CreateIndex
CREATE INDEX "_users_passwordResetToken_idx" ON "_users"("passwordResetToken");

-- CreateIndex
CREATE INDEX "_signup_tokens_tokenId_idx" ON "_signup_tokens"("tokenId");

-- CreateIndex
CREATE INDEX "_signup_tokens_generatedByUserId_idx" ON "_signup_tokens"("generatedByUserId");

-- CreateIndex
CREATE INDEX "_signup_tokens_token_idx" ON "_signup_tokens"("token");

-- CreateIndex
CREATE INDEX "_access_tokens_tokenId_idx" ON "_access_tokens"("tokenId");

-- CreateIndex
CREATE INDEX "_access_tokens_userId_idx" ON "_access_tokens"("userId");

-- CreateIndex
CREATE INDEX "_access_tokens_token_idx" ON "_access_tokens"("token");

-- AddForeignKey
ALTER TABLE "_signup_tokens" ADD CONSTRAINT "_signup_tokens_generatedByUserId_fkey" FOREIGN KEY ("generatedByUserId") REFERENCES "_users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_access_tokens" ADD CONSTRAINT "_access_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "_users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
