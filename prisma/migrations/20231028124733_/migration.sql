/*
  Warnings:

  - You are about to drop the column `thumbnailKey` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `reviewReplies` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,key]` on the table `user_medias` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "reviewReplies" DROP CONSTRAINT "reviewReplies_reviewId_fkey";

-- DropForeignKey
ALTER TABLE "reviewReplies" DROP CONSTRAINT "reviewReplies_shopId_fkey";

-- DropIndex
DROP INDEX "products_thumbnailKey_key";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "thumbnailKey";

-- DropTable
DROP TABLE "reviewReplies";

-- CreateTable
CREATE TABLE "review_replies" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "shopId" INTEGER NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_replies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_medias_userId_key_key" ON "user_medias"("userId", "key");

-- AddForeignKey
ALTER TABLE "review_replies" ADD CONSTRAINT "review_replies_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_replies" ADD CONSTRAINT "review_replies_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
