/*
  Warnings:

  - You are about to drop the column `userId` on the `reviews` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "review_replies" DROP CONSTRAINT "review_replies_shopId_fkey";

-- AlterTable
ALTER TABLE "review_replies" ALTER COLUMN "shopId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "userId",
ADD COLUMN     "customerId" INTEGER,
ALTER COLUMN "text" DROP NOT NULL,
ALTER COLUMN "rating" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
