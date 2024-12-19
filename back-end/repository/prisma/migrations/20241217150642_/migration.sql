/*
  Warnings:

  - Made the column `user_id` on table `Employee` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_user_id_fkey";

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "user_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
