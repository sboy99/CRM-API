/*
  Warnings:

  - The `created_at` column on the `Account` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `created_at` column on the `employees` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `created_at` column on the `salary_schemes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `created_at` column on the `sessions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `updated_at` on the `Account` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `updated_at` on the `employees` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `updated_at` on the `salary_schemes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `updated_at` on the `sessions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "created_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "updated_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "created_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "updated_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "salary_schemes" DROP COLUMN "created_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "updated_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "is_blocked" SET DEFAULT false,
DROP COLUMN "created_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "updated_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
