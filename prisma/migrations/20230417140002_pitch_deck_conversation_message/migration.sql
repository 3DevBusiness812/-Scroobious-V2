-- AlterTable
ALTER TABLE "conversation_message" ADD COLUMN     "context_details" JSONB,
ADD COLUMN     "pitch_deck_id" VARCHAR;

-- AddForeignKey
ALTER TABLE "conversation_message" ADD CONSTRAINT "fk conversation_message pitch_deck_id" FOREIGN KEY ("pitch_deck_id") REFERENCES "pitch_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
