-- AddForeignKey
ALTER TABLE "pitch_written_feedback_comment" ADD CONSTRAINT "fk pitch_written_feedback_comment created_by_id" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
