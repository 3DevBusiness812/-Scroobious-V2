-- CreateTable
CREATE TABLE "pitch_deck_section" (
    "id" VARCHAR NOT NULL,
    "pitch_deck_id" VARCHAR NOT NULL,
    "page_number" INTEGER NOT NULL,
    "course_step_definition_id" VARCHAR,
    "custom_section_name" VARCHAR,

    CONSTRAINT "pk pitch_deck_section id" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pitch_deck_section_page_number_idx" ON "pitch_deck_section"("page_number");

-- CreateIndex
CREATE UNIQUE INDEX "pitch_deck_section_pitch_deck_id_page_number_key" ON "pitch_deck_section"("pitch_deck_id", "page_number");

-- AddForeignKey
ALTER TABLE "pitch_deck_section" ADD CONSTRAINT "pitch_deck_section_pitch_deck_id_fkey" FOREIGN KEY ("pitch_deck_id") REFERENCES "pitch_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pitch_deck_section" ADD CONSTRAINT "pitch_deck_section_course_step_definition_id_fkey" FOREIGN KEY ("course_step_definition_id") REFERENCES "course_step_definition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Custom check:
-- a record can either reference a `course_step_definition` or be a `custom_section_name`, but not both
--
ALTER TABLE "pitch_deck_section"
  ADD CONSTRAINT "unique_reference_type_check" CHECK (
     (
      ("course_step_definition_id" is not null)::integer +
      ("custom_section_name" is not null)::integer
    ) = 1
  );
