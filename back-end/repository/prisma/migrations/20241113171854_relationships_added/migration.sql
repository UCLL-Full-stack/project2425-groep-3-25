/*
  Warnings:

  - You are about to drop the column `companyId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bedrijf_id` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bedrijf_id` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categorie_id` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_companyId_fkey";

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "bedrijf_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "companyId",
ADD COLUMN     "bedrijf_id" INTEGER NOT NULL,
ADD COLUMN     "categorie_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Employee_Project" (
    "employee_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "rol" TEXT NOT NULL,

    CONSTRAINT "Employee_Project_pkey" PRIMARY KEY ("employee_id","project_id")
);

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_bedrijf_id_fkey" FOREIGN KEY ("bedrijf_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_bedrijf_id_fkey" FOREIGN KEY ("bedrijf_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_categorie_id_fkey" FOREIGN KEY ("categorie_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee_Project" ADD CONSTRAINT "Employee_Project_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee_Project" ADD CONSTRAINT "Employee_Project_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
