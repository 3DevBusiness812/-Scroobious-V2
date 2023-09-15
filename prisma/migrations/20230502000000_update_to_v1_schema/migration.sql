-- DropIndex
DROP INDEX "uq pitch_meeting_feedback recording_file_id";

-- DropIndex
DROP INDEX "uq pitch_written_feedback original_pitch_deck_id";

-- DropIndex
DROP INDEX "uq pitch_written_feedback reviewed_pitch_deck_id";

-- AlterTable
ALTER TABLE "suggested_resource" ADD COLUMN     "description" VARCHAR;

