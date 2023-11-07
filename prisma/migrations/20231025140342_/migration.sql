/*
  Warnings:

  - You are about to drop the column `senderId` on the `chat_messages` table. All the data in the column will be lost.
  - You are about to drop the column `profilePictureKey` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `medias` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "chat_messages" DROP CONSTRAINT "chat_messages_chatId_fkey";

-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_customerId_fkey";

-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_shopId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_profilePictureKey_fkey";

-- DropIndex
DROP INDEX "users_profilePictureKey_key";

-- AlterTable
ALTER TABLE "chat_messages" DROP COLUMN "senderId";

-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "visibilityCustomer" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "visibilityShop" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "customerId" DROP NOT NULL,
ALTER COLUMN "shopId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "profilePictureKey";

-- DropTable
DROP TABLE "medias";

-- CreateTable
CREATE TABLE "user_medias" (
    "id" SERIAL NOT NULL,
    "mimetype" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "originalName" TEXT NOT NULL,
    "name" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_medias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_medias" (
    "id" SERIAL NOT NULL,
    "mimetype" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "originalName" TEXT NOT NULL,
    "name" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_medias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_medias_key_key" ON "user_medias"("key");

-- CreateIndex
CREATE UNIQUE INDEX "user_medias_userId_key" ON "user_medias"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "product_medias_key_key" ON "product_medias"("key");

-- AddForeignKey
ALTER TABLE "user_medias" ADD CONSTRAINT "user_medias_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_medias" ADD CONSTRAINT "product_medias_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shops"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
