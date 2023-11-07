/*
  Warnings:

  - Added the required column `quantity` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitOfMeasurement` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductMeasurementUnit" AS ENUM ('KG', 'G', 'L', 'ML', 'PCS');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "accepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "quantity" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "unitOfMeasurement" "ProductMeasurementUnit" NOT NULL;
