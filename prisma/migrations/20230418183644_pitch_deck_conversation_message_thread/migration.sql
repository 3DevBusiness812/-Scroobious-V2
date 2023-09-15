-- AlterTable
ALTER TABLE "conversation_message" ADD COLUMN     "root_thread_message_id" VARCHAR;

-- AddForeignKey
ALTER TABLE "conversation_message" ADD CONSTRAINT "fk conversation_message root_thread_message_id" FOREIGN KEY ("root_thread_message_id") REFERENCES "conversation_message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
