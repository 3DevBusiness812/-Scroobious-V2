-- AlterTable
ALTER TABLE "pitch_deck" ADD COLUMN     "text_content" TEXT,
ADD COLUMN     "text_summary" TEXT;

-- AlterTable
ALTER TABLE "video" ADD COLUMN     "transcription" TEXT,
ADD COLUMN     "transcription_raw" JSONB;
