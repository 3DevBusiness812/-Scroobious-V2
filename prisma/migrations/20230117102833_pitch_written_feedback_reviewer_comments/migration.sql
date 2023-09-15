-- CreateTable
CREATE TABLE "pitch_written_feedback_comment" (
    "id" TEXT NOT NULL,
    "v" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL DEFAULT 1,
    "owner_id" VARCHAR NOT NULL,
    "details" JSONB,
    "change_reason" VARCHAR,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "pitch_written_feedback_id" VARCHAR NOT NULL,

    CONSTRAINT "pk pitch_written_feedback_comment id v" PRIMARY KEY ("id","v")
);

-- AddForeignKey
ALTER TABLE "pitch_written_feedback_comment" ADD CONSTRAINT "fk pitch_written_feedback pitch_written_feedback_id" FOREIGN KEY ("pitch_written_feedback_id") REFERENCES "pitch_written_feedback"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
