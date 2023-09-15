-- AlterTable
ALTER TABLE "pitch_deck" ADD COLUMN     "is_categorized" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "num_pages" INTEGER NOT NULL DEFAULT 0;
