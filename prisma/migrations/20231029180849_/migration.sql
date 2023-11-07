/*
  Warnings:

  - A unique constraint covering the columns `[productId,customerId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_categoryId_fkey";

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "roles" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "reviews_productId_customerId_key" ON "reviews"("productId", "customerId");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
