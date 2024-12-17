/*
  Warnings:

  - You are about to drop the column `contact_informatie` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `telefoonnummer` on the `Company` table. All the data in the column will be lost.
  - Added the required column `validationInfo` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "contact_informatie",
DROP COLUMN "telefoonnummer",
ADD COLUMN     "validationInfo" TEXT NOT NULL;
