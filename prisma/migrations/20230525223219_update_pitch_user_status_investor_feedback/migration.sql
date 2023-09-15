-- AlterTable
ALTER TABLE "pitch_user_status" ADD COLUMN     "business_idea_comments" TEXT,
ADD COLUMN     "business_idea_rating" INTEGER,
ADD COLUMN     "founder_impression_comments" TEXT,
ADD COLUMN     "founder_impression_rating" INTEGER,
ADD COLUMN     "pitch_materials_comments" TEXT,
ADD COLUMN     "pitch_materials_rating" INTEGER,
ADD COLUMN     "share_feedback_directly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "share_feedback_with_founder" BOOLEAN NOT NULL DEFAULT true;
