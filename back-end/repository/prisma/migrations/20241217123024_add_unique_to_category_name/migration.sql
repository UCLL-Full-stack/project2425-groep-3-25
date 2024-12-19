/*
  Warnings:

  - A unique constraint covering the columns `[naam]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Category_naam_key" ON "Category"("naam");
