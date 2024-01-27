-- CreateTable
CREATE TABLE "_news_letter" (
    "newsLetterId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "_news_letter_pkey" PRIMARY KEY ("newsLetterId")
);

-- CreateIndex
CREATE UNIQUE INDEX "_news_letter_email_key" ON "_news_letter"("email");

-- CreateIndex
CREATE INDEX "_news_letter_newsLetterId_idx" ON "_news_letter"("newsLetterId");

-- CreateIndex
CREATE INDEX "_news_letter_email_idx" ON "_news_letter"("email");
