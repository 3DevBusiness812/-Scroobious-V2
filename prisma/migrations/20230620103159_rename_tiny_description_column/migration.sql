/*
  Warnings:

  - You are about to drop the column `short_description_ai_generated` on the `startup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "startup" DROP COLUMN "short_description_ai_generated",
ADD COLUMN     "tiny_description" VARCHAR;
