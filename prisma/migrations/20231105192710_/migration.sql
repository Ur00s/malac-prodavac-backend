/*
  Warnings:

  - You are about to drop the column `recipientId` on the `chat_messages` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customerId,shopId]` on the table `chats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `recipientUserId` to the `chat_messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "chat_messages_chatId_key";

-- AlterTable
ALTER TABLE "chat_messages" DROP COLUMN "recipientId",
ADD COLUMN     "recipientUserId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "chats_customerId_shopId_key" ON "chats"("customerId", "shopId");
