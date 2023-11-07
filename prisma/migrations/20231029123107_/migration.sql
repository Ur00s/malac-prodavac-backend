/*
  Warnings:

  - A unique constraint covering the columns `[parentCategoryId,name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "categories_parentCategoryId_name_key" ON "categories"("parentCategoryId", "name");
