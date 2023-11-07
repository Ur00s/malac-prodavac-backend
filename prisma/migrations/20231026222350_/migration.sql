-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_shopId_fkey";

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
