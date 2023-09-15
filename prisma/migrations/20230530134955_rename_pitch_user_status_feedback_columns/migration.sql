/*
  Warnings:

  - You are about to drop the column `share_feedback_directly` on the `pitch_user_status` table. All the data in the column will be lost.
  - You are about to drop the column `share_feedback_with_founder` on the `pitch_user_status` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pitch_user_status" DROP COLUMN "share_feedback_directly",
DROP COLUMN "share_feedback_with_founder",
ADD COLUMN     "share_review_directly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "share_review_with_founder" BOOLEAN NOT NULL DEFAULT true;
